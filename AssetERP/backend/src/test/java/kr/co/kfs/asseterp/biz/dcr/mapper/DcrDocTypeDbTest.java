package kr.co.kfs.asseterp.biz.dcr.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocTypePushReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocTypeRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocTypeUpdateReq;
import kr.co.kfs.asseterp.biz.dcr.service.DcrDocTypeService;
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

/** E18 문서양식등록(Dcr05_DocType)의 쓰기를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(DcrDocTypeService.class)
class DcrDocTypeDbTest {

    @Autowired DcrDocTypeService service;
    @Autowired JdbcTemplate jdbc;

    /** 문서구분에 연결된 양식(dcr06)이 있는 고객사 */
    private static final long CLIENT = 79L;
    private final UserPrincipal admin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN", "ROLE_ADMIN")).build();
    private final UserPrincipal client = UserPrincipal.builder().userId(-1L).companyId(CLIENT).roles(List.of("ROLE_USER")).build();

    private int count(String sql, Object... args) {
        return jdbc.queryForObject(sql, Integer.class, args);
    }

    @Test
    void 조회는_회사별로_관리자만_다른_회사를_본다() {
        assertThat(service.search(admin, null, "%", 0L)).hasSize(count("select count(*) from dcr05_doc_type where dcr05_company_id = 0"));
        // 구분 코드(DocFormClassCode)가 그 회사에 없으면 AS-IS INNER JOIN 때문에 조회에 안 나온다 (회사 79가 그렇다)
        assertThat(service.search(admin, null, "%", 28000L)).hasSize(30);
        assertThat(service.search(admin, null, "%", CLIENT)).isEmpty();
        // 일반 사용자가 다른 회사를 지정해도 로그인 회사 것만
        assertThat(service.search(client, null, "%", 0L)).allMatch(r -> r.companyId() == CLIENT);
    }

    @Test
    void 등록_수정_삭제() {
        DcrDocTypeRes created = service.create(admin, new DcrDocTypeUpdateReq("시험양식", "<p>내용</p>", "비고", "999"));
        assertThat(created.companyId()).isZero();
        assertThat(created.docFormClassCode()).isEqualTo("999");
        assertThat(service.search(admin, "시험양식", "%", 0L)).extracting(DcrDocTypeRes::docTypeId).contains(created.docTypeId());

        DcrDocTypeRes updated = service.update(admin, created.docTypeId(), new DcrDocTypeUpdateReq("시험양식2", "<p>x</p>", null, "999"), null);
        assertThat(updated.title()).isEqualTo("시험양식2");

        assertThatThrownBy(() -> service.create(admin, new DcrDocTypeUpdateReq("제목", "내용", null, null))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.create(admin, new DcrDocTypeUpdateReq(null, "내용", null, "999"))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.create(admin, new DcrDocTypeUpdateReq("제목", "", null, "999"))).isInstanceOf(BusinessException.class);

        assertThat(service.delete(admin, null, List.of(created.docTypeId()))).isEqualTo(1);
        assertThat(count("select count(*) from dcr05_doc_type where dcr05_doc_type_id = ?", created.docTypeId())).isZero();
    }

    @Test
    void 문서분류에_지정된_양식은_지울_수_없고_다른_회사_양식은_안_지워진다() {
        Long related = jdbc.queryForObject("select min(dcr06_doc_type_id) from dcr06_relate_doc_type", Long.class);
        int before = count("select count(*) from dcr05_doc_type");
        assertThatThrownBy(() -> service.delete(admin, null, List.of(related))).isInstanceOf(BusinessException.class)
                .hasMessageContaining("문서분류 지정된 양식이 포함되어 있습니다.");
        assertThat(count("select count(*) from dcr05_doc_type")).isEqualTo(before);

        DcrDocTypeRes created = service.create(admin, new DcrDocTypeUpdateReq("시험양식", "내용", null, "999"));
        // 일반 사용자는 자기 회사만 → 관리자 회사 양식은 0건 삭제
        assertThat(service.delete(client, 0L, List.of(created.docTypeId()))).isZero();
    }

    @Test
    void 내보내기는_관리자만_고른_양식을_목적지_회사에_새_ID로_복사한다() {
        List<DcrDocTypeRes> src = service.search(admin, null, "050", 0L);
        List<Long> ids = src.stream().map(DcrDocTypeRes::docTypeId).limit(2).toList();
        int before = count("select count(*) from dcr05_doc_type where dcr05_company_id = ?", CLIENT);
        assertThat(service.pushData(admin, new DcrDocTypePushReq(CLIENT, 0L, ids))).isEqualTo(ids.size());
        assertThat(count("select count(*) from dcr05_doc_type where dcr05_company_id = ?", CLIENT)).isEqualTo(before + ids.size());
        assertThat(jdbc.queryForList("select dcr05_title from dcr05_doc_type where dcr05_company_id = ? and dcr05_doc_form_class_cd = '050'", String.class, CLIENT))
                .containsAll(src.stream().limit(2).map(DcrDocTypeRes::title).toList());

        assertThatThrownBy(() -> service.pushData(client, new DcrDocTypePushReq(CLIENT, CLIENT, ids))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.pushData(admin, new DcrDocTypePushReq(CLIENT, 0L, List.of()))).isInstanceOf(BusinessException.class);
    }

    @Test
    void 구분코드를_쓰는_양식이_있으면_코드_삭제_검사가_거절한다() {
        assertThatThrownBy(() -> service.checkDocFormClassCode(admin, "999")).isInstanceOf(BusinessException.class)
                .hasMessageContaining("사용중인 코드는 삭제 불가합니다");
        service.checkDocFormClassCode(admin, "ZZZ");
    }
}
