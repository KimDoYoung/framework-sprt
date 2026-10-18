package kr.co.kfs.asseterp.biz.dcr.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrAdminTreeRow;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrCheckRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrClassTreeRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrClassTreeSaveReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocTypeRowRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocTypeSaveReq;
import kr.co.kfs.asseterp.biz.dcr.service.DcrClassTreeService;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * E16 문서분류의 여러 테이블에 쓰는 동작(삭제 = 상신문서→폐기문서·삭제 이력, 운용사 반영)을 asseterpdb에서 실제로 돌리고 롤백한다.
 * 없는 회사(99999)로 시험하고, admin(0) 회사 데이터는 읽기만 한다.
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(DcrClassTreeService.class)
class DcrClassTreeDbTest {

    private static final long FAKE = 99999L;

    @Autowired DcrClassTreeService service;
    @Autowired DcrClassTreeMapper mapper;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal fake = UserPrincipal.builder().userId(1L).companyId(FAKE).roles(List.of("ROLE_ADMIN")).build();

    private DcrDocTypeRowRes newDocType(Long parentId, String code) {
        return service.saveDocTypes(fake, List.of(new DcrDocTypeSaveReq(0L, parentId, "시험구분", code, "1", null, "10", null, null, "true", null, null))).get(0);
    }

    @Test
    void 삭제는_아래_전체와_상신문서를_폐기문서로_옮기고_이력을_남긴다() {
        DcrClassTreeRes root = service.createClassTree(fake, new DcrClassTreeSaveReq(0L, "시험루트", "ZT01", "1", null));
        DcrClassTreeRes child = service.createClassTree(fake, new DcrClassTreeSaveReq(root.classTreeId(), "시험하위", "ZT02", "1", null));
        DcrDocTypeRowRes doc = newDocType(child.classTreeId(), "ZT03");
        long apprId = jdbc.queryForObject("select f_create_seq()", Long.class);
        jdbc.update("insert into apr01_appr (apr01_appr_id, apr01_title, apr01_status_cd, apr01_reg_emp_id, apr01_company_id, apr01_class_tree_id) values (?, '시험상신', '10', 1, ?, ?)",
                apprId, FAKE, doc.classTreeId());

        // 상신문서만 있으면 "continue", 건수는 그 합
        DcrCheckRes check = service.deleteCheck(root.classTreeId());
        assertThat(check.status()).isEqualTo(1);
        assertThat(check.message()).isEqualTo("continue");

        assertThat(service.delete(fake, root.classTreeId())).isEqualTo(3);
        assertThat(jdbc.queryForObject("select count(*) from dcr01_class_tree where dcr01_company_id = ?", Integer.class, FAKE)).isZero();
        assertThat(jdbc.queryForObject("select count(*) from apr01_appr where apr01_appr_id = ?", Integer.class, apprId)).isZero();
        assertThat(jdbc.queryForObject("select count(*) from apr99_appr_del where apr99_appr_id = ? and apr99_del_emp_id = 1", Integer.class, apprId)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select count(*) from dcr99_class_tree_del where dcr99_company_id = ? and dcr99_person_id = 1", Integer.class, FAKE)).isEqualTo(3);
    }

    @Test
    void 삭제_점검_문구는_원본_그대로() {
        DcrClassTreeRes root = service.createClassTree(fake, new DcrClassTreeSaveReq(0L, "시험루트", "ZT01", "1", null));
        DcrDocTypeRowRes doc = newDocType(root.classTreeId(), "ZT03");
        jdbc.update("insert into dcr30_link (dcr30_link_id, dcr30_class_tree_id, dcr30_company_id, dcr30_link_cd) values (f_create_seq(), ?, ?, 'ZT')", doc.classTreeId(), FAKE);
        // 문서분류지정만 있으면 "1건의 문서분류지정, " (원본의 `msg != null`이 항상 참)
        assertThat(service.deleteCheck(root.classTreeId())).isEqualTo(new DcrCheckRes(1, "1건의 문서분류지정, "));
        // 같은 SqlSession(테스트 트랜잭션)에서는 같은 인자의 조회가 캐시되므로 둘 다 있는 다른 분류로 본다
        DcrClassTreeRes root2 = service.createClassTree(fake, new DcrClassTreeSaveReq(0L, "시험루트2", "ZT04", "1", null));
        DcrDocTypeRowRes doc2 = newDocType(root2.classTreeId(), "ZT05");
        jdbc.update("insert into dcr30_link (dcr30_link_id, dcr30_class_tree_id, dcr30_company_id, dcr30_link_cd) values (f_create_seq(), ?, ?, 'ZT')", doc2.classTreeId(), FAKE);
        long apprId = jdbc.queryForObject("select f_create_seq()", Long.class);
        jdbc.update("insert into apr01_appr (apr01_appr_id, apr01_title, apr01_status_cd, apr01_reg_emp_id, apr01_company_id, apr01_class_tree_id) values (?, '시험상신', '10', 1, ?, ?)",
                apprId, FAKE, doc2.classTreeId());
        assertThat(service.deleteCheck(root2.classTreeId())).isEqualTo(new DcrCheckRes(2, "1건의 문서분류지정, 1건의 상신문서"));
    }

    @Test
    void 운용사_반영은_조상부터_만들고_두번째는_고치며_연관_내부통제를_다시_만든다() {
        // admin(0) 회사에서 법규가 연결된 문서구분(T)을 하나 고른다 (읽기만)
        Long adminT = jdbc.queryForObject("select dcr20_dcr_class_tree_id from dcr20_relate_ics join dcr01_class_tree on dcr01_class_tree_id = dcr20_dcr_class_tree_id "
                + "where dcr20_company_id = 0 and dcr01_company_id = 0 and dcr01_type_cd = 'T' limit 1", Long.class);
        List<DcrAdminTreeRow> std = mapper.selectAdminTree(adminT);
        assertThat(std).hasSizeGreaterThanOrEqualTo(2);
        assertThat(std.get(std.size() - 1).classTreeId()).isEqualTo(adminT);   // 고른 분류가 마지막, 조상이 먼저
        assertThat(std.get(std.size() - 1).typeCode()).isEqualTo("T");

        for (DcrAdminTreeRow s : std) {
            assertThat(mapper.countByInsertBak(FAKE, s.classTreeId())).isZero();
            mapper.insertAdminTree(FAKE, s.classTreeId());
        }
        assertThat(jdbc.queryForObject("select count(*) from dcr01_class_tree where dcr01_company_id = ?", Integer.class, FAKE)).isEqualTo(std.size());
        // 상위 분류는 복사된 쪽 ID로 이어진다
        Long copiedT = jdbc.queryForObject("select dcr01_class_tree_id from dcr01_class_tree where dcr01_company_id = ? and dcr01_insert_bak_dcr_id = ?", Long.class, FAKE, adminT);
        Long copiedParent = jdbc.queryForObject("select dcr01_parent_tree_id from dcr01_class_tree where dcr01_class_tree_id = ?", Long.class, copiedT);
        Long adminParent = std.get(std.size() - 1).parentTreeId();
        assertThat(jdbc.queryForObject("select dcr01_insert_bak_dcr_id from dcr01_class_tree where dcr01_class_tree_id = ?", Long.class, copiedParent)).isEqualTo(adminParent);

        // 내부통제 가이드를 쓰는 회사는 연관 내부통제를 지우고 다시 만든다 (두 번 해도 같은 수)
        int adminRelates = jdbc.queryForObject("select count(*) from dcr20_relate_ics where dcr20_company_id = 0 and dcr20_dcr_class_tree_id = ?", Integer.class, adminT);
        for (int i = 0; i < 2; i++) {
            mapper.deleteRelateIcsByInsertBak(FAKE, adminT);
            mapper.insertRelateIcsByInsertBak(FAKE, adminT);
            assertThat(jdbc.queryForObject("select count(*) from dcr20_relate_ics where dcr20_company_id = ? and dcr20_dcr_class_tree_id = ?", Integer.class, FAKE, copiedT)).isEqualTo(adminRelates);
        }

        // 두 번째 반영은 UPDATE (이름·순서 등을 admin 값으로 되돌린다) — 관리자가 내려준(admin_yn) 행만
        jdbc.update("update dcr01_class_tree set dcr01_class_tree_nm = '바뀜' where dcr01_class_tree_id = ?", copiedT);
        for (DcrAdminTreeRow s : std) {
            assertThat(mapper.countByInsertBak(FAKE, s.classTreeId())).isEqualTo(1);
            mapper.updateAdminTree(FAKE, s.classTreeId(), s);
        }
        assertThat(jdbc.queryForObject("select dcr01_class_tree_nm from dcr01_class_tree where dcr01_class_tree_id = ?", String.class, copiedT))
                .isEqualTo(std.get(std.size() - 1).classTreeName());
        assertThat(jdbc.queryForObject("select count(*) from dcr01_class_tree where dcr01_company_id = ?", Integer.class, FAKE)).isEqualTo(std.size());
    }
}
