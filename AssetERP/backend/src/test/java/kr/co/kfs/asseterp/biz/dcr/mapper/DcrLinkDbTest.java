package kr.co.kfs.asseterp.biz.dcr.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.com.dto.FormMappingRes;
import kr.co.kfs.asseterp.biz.com.dto.FormMappingSaveReq;
import kr.co.kfs.asseterp.biz.com.service.ComFormMappingService;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrLinkCopyReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrLinkRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrLinkSaveReq;
import kr.co.kfs.asseterp.biz.dcr.service.DcrLinkService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** E17 문서분류지정(Dcr30_Link)·데이터맵핑 양식(Com10_FormMapping)의 쓰기를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({DcrLinkService.class, ComFormMappingService.class})
class DcrLinkDbTest {

    @Autowired DcrLinkService linkService;
    @Autowired ComFormMappingService formService;
    @Autowired JdbcTemplate jdbc;

    private static final long ADMIN = 0L;
    /** 관리자 회사의 문서분류 복사본(insert_bak)이 있는 고객사 */
    private static final long TARGET = 202601209259551L;
    private final UserPrincipal admin = UserPrincipal.builder().userId(-1L).companyId(ADMIN).roles(List.of("ROLE_SYSADMIN")).build();
    private final UserPrincipal client = UserPrincipal.builder().userId(-1L).companyId(TARGET).roles(List.of("ROLE_ADMIN")).build();

    private int count(String sql, Object... args) {
        return jdbc.queryForObject(sql, Integer.class, args);
    }

    @Test
    void 조회는_AS_IS와_같은_건수_다른회사는_관리자만() {
        assertThat(linkService.search(admin, null, "")).hasSize(count("select count(*) from dcr30_link where dcr30_company_id = 0 and dcr30_link_cd in (select sys09_code from sys09_code join sys08_code_kind on sys09_code_kind_id = sys08_code_kind_id where sys08_kind_cd = 'LinkCode' and sys09_company_id = 0)"));
        assertThat(linkService.search(admin, TARGET, "")).isNotEmpty();
        assertThatThrownBy(() -> linkService.search(client, ADMIN, "")).isInstanceOf(BusinessException.class);
    }

    @Test
    void linkCheck는_없는_Link만_넣고_두번째는_0건_관리자만() {
        int missing = count("select count(*) from sys01_company co cross join (select distinct sys09_code cd from sys09_code c join sys08_code_kind k on sys09_code_kind_id = sys08_code_kind_id where sys08_kind_cd = 'LinkCode') c "
                + "where not exists (select 1 from dcr30_link l where l.dcr30_company_id = co.sys01_company_id and l.dcr30_link_cd = c.cd)");
        assertThat(linkService.linkCheck(admin)).isEqualTo(missing);
        assertThat(linkService.linkCheck(admin)).isZero();
        assertThatThrownBy(() -> linkService.linkCheck(client)).isInstanceOf(BusinessException.class);
    }

    @Test
    void 저장은_문서분류와_비고만_바꾸고_다른_회사_행은_못_건드린다() {
        DcrLinkRes link = linkService.search(admin, null, "").get(0);
        assertThat(linkService.update(admin, null, List.of(new DcrLinkSaveReq(link.linkId(), link.classTreeId(), "시험비고")))).isEqualTo(1);
        assertThat(linkService.search(admin, null, "").stream().filter(l -> l.linkId().equals(link.linkId())).findFirst().orElseThrow().note()).isEqualTo("시험비고");
        assertThatThrownBy(() -> linkService.update(admin, TARGET, List.of(new DcrLinkSaveReq(link.linkId(), null, "x")))).isInstanceOf(BusinessException.class);
        linkService.updateNote(admin, link.linkId(), "시험비고2");
        assertThat(jdbc.queryForObject("select dcr30_note from dcr30_link where dcr30_link_id = ?", String.class, link.linkId())).isEqualTo("시험비고2");
    }

    @Test
    void 문서분류지정복사는_고른_회사의_Link에_복사본_분류를_넣는다() {
        DcrLinkRes src = linkService.search(admin, null, "").stream()
                .filter(l -> l.classTreeId() != null
                        && count("select count(*) from dcr01_class_tree where dcr01_company_id = ? and dcr01_insert_bak_dcr_id = ?", TARGET, l.classTreeId()) > 0)
                .findFirst().orElseThrow();
        Long expected = jdbc.queryForObject("select dcr01_class_tree_id from dcr01_class_tree where dcr01_company_id = ? and dcr01_insert_bak_dcr_id = ?", Long.class, TARGET, src.classTreeId());
        assertThat(linkService.copyLink(admin, new DcrLinkCopyReq(List.of(TARGET), List.of(src.linkId())))).isEqualTo(1);
        assertThat(jdbc.queryForObject("select dcr30_class_tree_id from dcr30_link where dcr30_company_id = ? and dcr30_link_cd = ?", Long.class, TARGET, src.linkCode())).isEqualTo(expected);
        assertThatThrownBy(() -> linkService.copyLink(client, new DcrLinkCopyReq(List.of(TARGET), List.of(src.linkId())))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> linkService.copyLink(admin, new DcrLinkCopyReq(List.of(), List.of(src.linkId())))).isInstanceOf(BusinessException.class);
    }

    @Test
    void 양식복사는_관리자_회사의_양식을_새_행으로_복사해_연결한다() {
        DcrLinkRes src = linkService.search(admin, null, "").stream().filter(l -> l.formMappingId() != null).findFirst().orElseThrow();
        int before = count("select count(*) from com10_form_mapping where com10_company_id = ?", TARGET);
        assertThat(linkService.copyForm(admin, new DcrLinkCopyReq(List.of(TARGET), List.of(src.linkId())))).isEqualTo(1);
        assertThat(count("select count(*) from com10_form_mapping where com10_company_id = ?", TARGET)).isEqualTo(before + 1);
        Long copied = jdbc.queryForObject("select dcr30_form_mapping_id from dcr30_link where dcr30_company_id = ? and dcr30_link_cd = ?", Long.class, TARGET, src.linkCode());
        assertThat(copied).isNotNull().isNotEqualTo(src.formMappingId());
        String content = jdbc.queryForObject("select com10_content from com10_form_mapping where com10_form_mapping_id = ?", String.class, copied);
        assertThat(content).isEqualTo(jdbc.queryForObject("select com10_content from com10_form_mapping where com10_form_mapping_id = ?", String.class, src.formMappingId()));
    }

    @Test
    void 양식_저장은_새_양식이면_등록하고_Link에_연결_있으면_내용만_바꾼다() {
        DcrLinkRes noForm = linkService.search(admin, null, "").stream().filter(l -> l.formMappingId() == null).findFirst().orElseThrow();
        Long id = formService.update(admin, new FormMappingSaveReq(null, noForm.linkId(), "<p>시험</p>"));
        assertThat(id).isNotNull();
        assertThat(jdbc.queryForObject("select dcr30_form_mapping_id from dcr30_link where dcr30_link_id = ?", Long.class, noForm.linkId())).isEqualTo(id);
        FormMappingRes saved = formService.get(admin, id);
        assertThat(saved.content()).isEqualTo("<p>시험</p>");
        assertThat(saved.companyId()).isEqualTo(ADMIN);
        assertThat(saved.linkCode()).isEqualTo(noForm.linkCode());

        formService.update(admin, new FormMappingSaveReq(id, noForm.linkId(), "<p>시험2</p>"));
        assertThat(formService.get(admin, id).content()).isEqualTo("<p>시험2</p>");
        assertThat(formService.get(admin, -1L)).isNull();
        assertThatThrownBy(() -> formService.update(client, new FormMappingSaveReq(id, null, "x"))).isInstanceOf(BusinessException.class);
    }
}
