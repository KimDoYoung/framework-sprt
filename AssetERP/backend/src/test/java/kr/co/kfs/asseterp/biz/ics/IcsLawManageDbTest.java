package kr.co.kfs.asseterp.biz.ics;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsCompanyInfoSaveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawManageRes;
import kr.co.kfs.asseterp.biz.ics.service.IcsLawService;
import kr.co.kfs.asseterp.biz.ics.service.IcsRelateManagerService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** H08 법규관리(Ics01_Tab_ClassTreeUser·Ics01_Lookup_Except·Ics01_Lookup_Share)의 쓰기를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({IcsLawService.class, IcsRelateManagerService.class})
class IcsLawManageDbTest {

    @Autowired IcsLawService law;
    @Autowired IcsRelateManagerService relate;
    @Autowired JdbcTemplate jdbc;

    private static final UserPrincipal ADMIN = UserPrincipal.builder().userId(-28656L).companyId(28000L).build();
    /** kfstest(28000)의 관리그룹 '전산그룹' */
    private static final long MANAGER = 202406031707128L;

    /** 회사 28000 설정이 아직 없는 법규 하나 */
    private long freshLawId() {
        return jdbc.queryForObject("select ics01_class_tree_id from ics01_class_tree where ics01_type_cd = 'IT' and ics01_company_id = 0"
                + " and not exists (select 1 from ics03_company_info where ics03_ics_class_tree_id = ics01_class_tree_id and ics03_company_id = 28000)"
                + " order by ics01_class_tree_cd limit 1", Long.class);
    }

    private Map<String, Object> companyInfo(long lawId) {
        return jdbc.queryForMap("select ics03_except_yn, ics03_auto_yn, ics03_advis_yn from ics03_company_info"
                + " where ics03_ics_class_tree_id = " + lawId + " and ics03_company_id = 28000");
    }

    @Test
    void 회사설정은_없으면_등록_있으면_수정하고_사용안함은_목록에서_빠진다() {
        long id = freshLawId();
        long before = law.searchManage(ADMIN, null, "", "", false, false, null, 0, 1).total();

        // 사용여부 설정 창: 제외만 보낸다 — 자동처리 false, 일임은 기존 값(없으면 false)
        law.saveCompanyInfo(ADMIN, List.of(new IcsCompanyInfoSaveReq(id, true, null, null)));
        assertThat(companyInfo(id)).containsEntry("ics03_except_yn", "true").containsEntry("ics03_auto_yn", "false").containsEntry("ics03_advis_yn", "false");
        assertThat(law.searchManage(ADMIN, null, "", "", false, false, null, 0, 1).total()).isEqualTo(before - 1);
        assertThat(law.searchExcept(ADMIN, null, "true", "", false)).anySatisfy(r -> assertThat(r.classTreeId()).isEqualTo(id));

        // 법규관리 화면: 셋 다 보낸다 → 같은 행이 바뀐다
        law.saveCompanyInfo(ADMIN, List.of(new IcsCompanyInfoSaveReq(id, false, true, true)));
        assertThat(companyInfo(id)).containsEntry("ics03_except_yn", "false").containsEntry("ics03_auto_yn", "true").containsEntry("ics03_advis_yn", "true");
        assertThat(jdbc.queryForObject("select count(*) from ics03_company_info where ics03_ics_class_tree_id = " + id + " and ics03_company_id = 28000", Integer.class)).isEqualTo(1);
        assertThat(law.searchManage(ADMIN, null, "", "", false, false, null, 0, 1).total()).isEqualTo(before);
        IcsLawManageRes row = law.refreshManage(ADMIN, id);
        assertThat(row.advisYn()).isEqualTo("true");
        assertThat(row.autoYn()).isEqualTo("true");
        assertThat(row.exceptYn()).isEqualTo("false");

        // 사용여부 창에서 다시 제외만 보내면 일임은 그대로, 자동처리는 false로 돌아간다(AS-IS 모델이 boolean)
        law.saveCompanyInfo(ADMIN, List.of(new IcsCompanyInfoSaveReq(id, true, null, null)));
        assertThat(companyInfo(id)).containsEntry("ics03_except_yn", "true").containsEntry("ics03_auto_yn", "false").containsEntry("ics03_advis_yn", "true");
    }

    @Test
    void 관리그룹_지정은_연결과_공유를_다시_만들고_바뀐_행을_돌려준다() {
        long id = freshLawId();
        int shares = jdbc.queryForObject("select count(*) from ics04_share where ics04_manager_id = " + MANAGER + " and ics04_company_id = 28000", Integer.class);

        List<IcsLawManageRes> rows = relate.relateUpdate(ADMIN, MANAGER, List.of(id));
        assertThat(rows).hasSize(1);
        assertThat(rows.get(0).classTreeId()).isEqualTo(id);
        assertThat(rows.get(0).managerGroupName()).isEqualTo("전산그룹");
        assertThat(relate.getByClassTree(ADMIN, id).managerId()).isEqualTo(MANAGER);
        assertThat(jdbc.queryForObject("select count(*) from sch02_share where sch02_info_id = " + id + " and sch02_company_id = 28000", Integer.class)).isEqualTo(shares);

        // 다시 지정하면 연결은 하나로 유지되고 공유는 새로 만들어진다
        relate.relateUpdate(ADMIN, MANAGER, List.of(id));
        assertThat(jdbc.queryForObject("select count(*) from ics05_relate_manager where ics05_ics_class_tree_id = " + id + " and ics05_company_id = 28000", Integer.class)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select count(*) from sch02_share where sch02_info_id = " + id + " and sch02_company_id = 28000", Integer.class)).isEqualTo(shares);

        // 다른 회사의 관리그룹·없는 관리그룹은 거절한다
        UserPrincipal other = UserPrincipal.builder().userId(-79L).companyId(79L).build();
        assertThatThrownBy(() -> relate.relateUpdate(other, MANAGER, List.of(id))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> relate.relateUpdate(ADMIN, null, List.of(id))).isInstanceOf(BusinessException.class);
    }
}
