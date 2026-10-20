package kr.co.kfs.asseterp.biz.icr;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeSaveReq;
import kr.co.kfs.asseterp.biz.icr.dto.IcrRuleContentReq;
import kr.co.kfs.asseterp.biz.icr.dto.IcrRuleRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrRuleSaveReq;
import kr.co.kfs.asseterp.biz.icr.service.IcrClassTreeService;
import kr.co.kfs.asseterp.biz.icr.service.IcrRelateManagerService;
import kr.co.kfs.asseterp.biz.icr.service.IcrRuleService;
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

/** H09 내규관리(Icr01_Tab_ClassTree·Icr01_Grid_IcrType·Icr01_Lookup_Share)의 쓰기를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({IcrClassTreeService.class, IcrRuleService.class, IcrRelateManagerService.class})
class IcrRuleDbTest {

    @Autowired IcrClassTreeService tree;
    @Autowired IcrRuleService rule;
    @Autowired IcrRelateManagerService relate;
    @Autowired JdbcTemplate jdbc;

    private static final UserPrincipal ADMIN = UserPrincipal.builder().userId(-28656L).companyId(28000L).build();
    private static final UserPrincipal OTHER = UserPrincipal.builder().userId(-1L).companyId(0L).build();
    /** kfstest(28000)의 관리그룹 '전산그룹' */
    private static final long MANAGER = 202406031707128L;

    private IcrClassTreeRes newClass(Long parentId, String code, String name) {
        return tree.create(ADMIN, new IcrClassTreeSaveReq(parentId, code, name, null));
    }

    private IcrRuleRes newRule(long parentId, String code, String name) {
        return rule.save(ADMIN, List.of(new IcrRuleSaveReq(-1L, parentId, code, name, "제출처", "관련조문", "true"))).get(0);
    }

    @Test
    void 분류_등록은_조회순서를_분류코드로_채우고_구분_IC_사용_true로_넣는다() {
        IcrClassTreeRes root = newClass(0L, "ZZ01", "시험분류");
        assertThat(root.seq()).isEqualTo("ZZ01");
        assertThat(jdbc.queryForMap("select icr01_type_cd, icr01_use_yn, icr01_company_id from icr01_class_tree where icr01_class_tree_id = " + root.classTreeId()))
                .containsEntry("icr01_type_cd", "IC").containsEntry("icr01_use_yn", "true").containsEntry("icr01_company_id", java.math.BigDecimal.valueOf(28000));

        IcrClassTreeRes edited = tree.update(ADMIN, root.classTreeId(), new IcrClassTreeSaveReq(null, "ZZ02", "시험분류2", null));
        assertThat(edited.classTreeName()).isEqualTo("시험분류2");
        assertThat(edited.seq()).isEqualTo("ZZ02");

        assertThatThrownBy(() -> newClass(0L, "", "이름")).isInstanceOf(BusinessException.class).hasMessageContaining("분류코드");
        assertThatThrownBy(() -> newClass(999999L, "ZZ03", "없는 상위")).isInstanceOf(BusinessException.class);
    }

    @Test
    void 내규_저장은_새_행을_넣고_고치고_상세내용은_편집_열과_함께_저장한다() {
        IcrClassTreeRes root = newClass(0L, "ZZ01", "시험분류");
        IcrRuleRes created = newRule(root.classTreeId(), "ZZ0101", "시험내규");
        assertThat(created.parentTreeId()).isEqualTo(root.classTreeId());
        assertThat(created.useYn()).isEqualTo("true");
        assertThat(jdbc.queryForObject("select icr01_type_cd from icr01_class_tree where icr01_class_tree_id = " + created.classTreeId(), String.class)).isEqualTo("IT");

        IcrRuleRes edited = rule.save(ADMIN, List.of(new IcrRuleSaveReq(created.classTreeId(), null, "ZZ0102", "시험내규2", "제출처2", "조문2", "false"))).get(0);
        assertThat(edited.classTreeCode()).isEqualTo("ZZ0102");
        assertThat(edited.useYn()).isEqualTo("false");

        IcrRuleRes withContent = rule.updateContent(ADMIN, created.classTreeId(), new IcrRuleContentReq("상세내용", "ZZ0103", "시험내규3", "제출처3", "조문3", "true"));
        assertThat(withContent.content()).isEqualTo("상세내용");
        assertThat(withContent.classTreeName()).isEqualTo("시험내규3");

        assertThat(rule.search(ADMIN, root.classTreeId(), null)).extracting(IcrRuleRes::classTreeId).contains(created.classTreeId());
        assertThat(rule.search(ADMIN, root.classTreeId(), "시험내규3")).hasSize(1);
        assertThat(rule.search(ADMIN, root.classTreeId(), "없는이름")).isEmpty();

        assertThatThrownBy(() -> rule.save(ADMIN, List.of(new IcrRuleSaveReq(-1L, root.classTreeId(), "ZZ0104", "", null, null, "true"))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("내규명");
        assertThat(rule.delete(ADMIN, List.of(created.classTreeId()))).isEqualTo(1);
    }

    @Test
    void 분류_이동은_자기와_하위로는_막고_삭제는_하위_내규까지_이력에_남기고_지운다() {
        IcrClassTreeRes a = newClass(0L, "ZZ01", "A");
        IcrClassTreeRes b = newClass(a.classTreeId(), "ZZ02", "B");
        IcrRuleRes r = newRule(b.classTreeId(), "ZZ0201", "내규");

        assertThatThrownBy(() -> tree.move(ADMIN, a.classTreeId(), b.classTreeId())).isInstanceOf(BusinessException.class);
        IcrClassTreeRes c = newClass(0L, "ZZ03", "C");
        tree.move(ADMIN, b.classTreeId(), c.classTreeId());
        assertThat(rule.search(ADMIN, c.classTreeId(), null)).extracting(IcrRuleRes::classTreeId).containsExactly(r.classTreeId());
        rule.save(ADMIN, List.of(new IcrRuleSaveReq(r.classTreeId(), null, "ZZ0201", "내규", null, null, "true")));

        int history = jdbc.queryForObject("select count(*) from icr99_class_tree_del", Integer.class);
        assertThat(tree.deleteAll(ADMIN, c.classTreeId())).isEqualTo(3);
        assertThat(jdbc.queryForObject("select count(*) from icr99_class_tree_del", Integer.class)).isEqualTo(history + 3);
        assertThat(jdbc.queryForObject("select count(*) from icr01_class_tree where icr01_class_tree_id in (" + c.classTreeId() + "," + b.classTreeId() + "," + r.classTreeId() + ")", Integer.class)).isZero();
    }

    @Test
    void 관리그룹_지정은_연결을_다시_만들고_공유를_채우고_바뀐_행을_돌려준다() {
        IcrClassTreeRes root = newClass(0L, "ZZ01", "시험분류");
        IcrRuleRes r = newRule(root.classTreeId(), "ZZ0101", "시험내규");
        int shares = jdbc.queryForObject("select count(*) from ics04_share where ics04_manager_id = " + MANAGER + " and ics04_company_id = 28000", Integer.class);

        // 연결이 없으면 미지정 관리그룹
        assertThat(relate.getByClassTree(ADMIN, r.classTreeId()).defaultYn()).isTrue();

        IcrRuleRes row = relate.relateUpdate(ADMIN, MANAGER, r.classTreeId());
        assertThat(row.managerGroupName()).isEqualTo("전산그룹");
        assertThat(relate.getByClassTree(ADMIN, r.classTreeId()).managerId()).isEqualTo(MANAGER);
        assertThat(jdbc.queryForObject("select count(*) from sch02_share where sch02_info_id = " + r.classTreeId() + " and sch02_company_id = 28000", Integer.class)).isEqualTo(shares);

        // 다시 지정하면 연결은 하나로 유지된다. 공유는 AS-IS(sch02_share.delete가 icrClassTreeId를 못 받아 지우지 않음)처럼 쌓인다
        relate.relateUpdate(ADMIN, MANAGER, r.classTreeId());
        assertThat(jdbc.queryForObject("select count(*) from icr05_relate_manager where icr05_icr_class_tree_id = " + r.classTreeId() + " and icr05_company_id = 28000", Integer.class)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select count(*) from sch02_share where sch02_info_id = " + r.classTreeId() + " and sch02_company_id = 28000", Integer.class)).isEqualTo(shares * 2);

        assertThatThrownBy(() -> relate.relateUpdate(ADMIN, null, r.classTreeId())).isInstanceOf(BusinessException.class).hasMessageContaining("관리그룹");
        assertThatThrownBy(() -> relate.relateUpdate(OTHER, MANAGER, r.classTreeId())).isInstanceOf(BusinessException.class);
    }

    @Test
    void 서식파일_행_삭제는_그_내규에_달린_행만_지운다() {
        IcrClassTreeRes root = newClass(0L, "ZZ01", "시험분류");
        IcrRuleRes r = newRule(root.classTreeId(), "ZZ0101", "시험내규");
        jdbc.update("insert into sys10_file (sys10_file_id, sys10_parent_id, sys10_file_nm, sys10_server_path, sys10_size, sys10_file_ext, sys10_reg_date) values (-9901, ?, '시험.txt', '/tmp', 1, 'txt', f_sysdate())", r.classTreeId());

        assertThatThrownBy(() -> rule.deleteFile(ADMIN, root.classTreeId(), -9901L)).isInstanceOf(BusinessException.class);
        assertThat(rule.refresh(ADMIN, r.classTreeId()).fileCount()).isEqualTo("1건");
        rule.deleteFile(ADMIN, r.classTreeId(), -9901L);
        assertThat(rule.refresh(ADMIN, r.classTreeId()).fileCount()).isEqualTo("0건");
        assertThatThrownBy(() -> rule.deleteFile(OTHER, r.classTreeId(), -9901L)).isInstanceOf(BusinessException.class);
    }

    @Test
    void 다른_회사의_분류와_내규는_읽지도_고치지도_못한다() {
        IcrClassTreeRes root = newClass(0L, "ZZ01", "시험분류");
        IcrRuleRes r = newRule(root.classTreeId(), "ZZ0101", "시험내규");

        assertThat(rule.search(OTHER, root.classTreeId(), null)).isEmpty();
        assertThatThrownBy(() -> rule.refresh(OTHER, r.classTreeId())).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> tree.update(OTHER, root.classTreeId(), new IcrClassTreeSaveReq(null, "X", "X", null))).isInstanceOf(BusinessException.class);
        assertThat(rule.delete(OTHER, List.of(r.classTreeId()))).isZero();
        assertThat(tree.deleteAll(OTHER, root.classTreeId())).isZero();
        assertThat(jdbc.queryForObject("select count(*) from icr01_class_tree where icr01_class_tree_id = " + root.classTreeId(), Integer.class)).isEqualTo(1);
    }
}
