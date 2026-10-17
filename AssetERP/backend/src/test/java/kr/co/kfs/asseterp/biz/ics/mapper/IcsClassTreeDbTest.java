package kr.co.kfs.asseterp.biz.ics.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.ClassTreeRes;
import kr.co.kfs.asseterp.biz.ics.dto.ClassTreeSaveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawSaveReq;
import kr.co.kfs.asseterp.biz.ics.service.IcsClassTreeService;
import kr.co.kfs.asseterp.biz.ics.service.IcsLawService;
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

/** E01 법규관리(관리자): 분류 트리·법규 조회와 등록·수정·이동·삭제를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({IcsClassTreeService.class, IcsLawService.class})
class IcsClassTreeDbTest {

    @Autowired IcsClassTreeService treeService;
    @Autowired IcsLawService lawService;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal admin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private final UserPrincipal company = UserPrincipal.builder().userId(-1L).companyId(28000L).roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 트리는_최상위부터_전위_순서로_깊이와_함께_나온다() {
        List<ClassTreeRes> tree = treeService.searchTree("IC");
        assertThat(tree).isNotEmpty();
        assertThat(tree.get(0).depth()).isEqualTo(1);
        assertThat(tree.get(0).parentTreeId()).isZero();
        // 전위 순서: 깊이가 한 번에 2 이상 늘지 않고, 각 노드의 직전 깊이-1 조상이 그 부모다
        for (int i = 1; i < tree.size(); i++) {
            assertThat(tree.get(i).depth()).isLessThanOrEqualTo(tree.get(i - 1).depth() + 1);
        }
    }

    @Test
    void 분류_등록_수정_이동_삭제_이력() {
        ClassTreeRes root = treeService.create(admin, new ClassTreeSaveReq(0L, "ZT100", "시험분류", null));
        assertThat(root.classTreeId()).isPositive();
        assertThat(root.seq()).isEqualTo("ZT100"); // 조회순서 = 분류코드
        ClassTreeRes child = treeService.create(admin, new ClassTreeSaveReq(root.classTreeId(), "ZT110", "시험하위", null));
        assertThat(child.parentTreeId()).isEqualTo(root.classTreeId());
        assertThat(treeService.searchTree("IC")).extracting(ClassTreeRes::classTreeId).contains(root.classTreeId(), child.classTreeId());

        ClassTreeRes edited = treeService.update(admin, child.classTreeId(), new ClassTreeSaveReq(null, "ZT111", "시험하위2", "무시됨"));
        assertThat(edited.classTreeCode()).isEqualTo("ZT111");
        assertThat(edited.seq()).isEqualTo("ZT111");

        // 법규를 하나 넣고, 분류 삭제 시 하위 법규까지 삭제 이력에 남는다
        IcsLawRes law = lawService.save(admin, List.of(new IcsLawSaveReq(-1L, child.classTreeId(), "ZT111-01", "시험법규", "제출처", "관련조문", "true"))).get(0);
        assertThat(law.classTreeId()).isPositive();
        long before = jdbc.queryForObject("select count(*) from ics99_class_tree_del", Long.class);
        assertThat(treeService.deleteAll(admin, root.classTreeId())).isEqualTo(3);
        assertThat(jdbc.queryForObject("select count(*) from ics99_class_tree_del", Long.class)).isEqualTo(before + 3);
        assertThat(treeService.searchTree("IC")).extracting(ClassTreeRes::classTreeId).doesNotContain(root.classTreeId(), child.classTreeId());
    }

    @Test
    void 법규_조회와_저장_이동_삭제() {
        ClassTreeRes a = treeService.create(admin, new ClassTreeSaveReq(0L, "ZT200", "시험A", null));
        ClassTreeRes b = treeService.create(admin, new ClassTreeSaveReq(0L, "ZT300", "시험B", null));
        IcsLawRes law = lawService.save(admin, List.of(new IcsLawSaveReq(-5L, a.classTreeId(), "ZT200-01", "시험법규", "금감원", "제1조", "false"))).get(0);
        assertThat(law.parentTreeId()).isEqualTo(a.classTreeId());
        assertThat(law.advisYn()).isEqualTo("false");
        assertThat(law.fileCount()).isEqualTo("0건");
        assertThat(law.revisionCount()).isEqualTo("0건");
        assertThat(lawService.search(admin, a.classTreeId(), null, "ZT200", false)).extracting(IcsLawRes::classTreeId).containsExactly(law.classTreeId());
        assertThat(lawService.search(admin, a.classTreeId(), null, "없는검색어", false)).isEmpty();
        assertThat(lawService.search(admin, a.classTreeId(), null, null, true)).isEmpty(); // 일임(자문)만

        IcsLawRes updated = lawService.save(admin, List.of(new IcsLawSaveReq(law.classTreeId(), null, "ZT200-02", "시험법규2", "제출처2", "제2조", "true"))).get(0);
        assertThat(updated.classTreeCode()).isEqualTo("ZT200-02");
        assertThat(updated.advisYn()).isEqualTo("true");
        assertThat(updated.parentTreeId()).isEqualTo(a.classTreeId()); // 상위는 그대로
        assertThat(lawService.search(admin, a.classTreeId(), null, null, true)).hasSize(1);

        treeService.move(admin, law.classTreeId(), b.classTreeId());
        assertThat(lawService.search(admin, a.classTreeId(), null, null, false)).isEmpty();
        assertThat(lawService.search(admin, b.classTreeId(), null, null, false)).hasSize(1);
        assertThat(lawService.refresh(admin, law.classTreeId()).parentTreeId()).isEqualTo(b.classTreeId());

        assertThat(lawService.delete(admin, List.of(law.classTreeId()))).isEqualTo(1);
        assertThat(lawService.search(admin, b.classTreeId(), null, null, false)).isEmpty();
    }

    @Test
    void 기존_분류로_법규를_조회한다() {
        List<ClassTreeRes> tree = treeService.searchTree("IC");
        List<IcsLawRes> laws = lawService.search(admin, tree.get(0).classTreeId(), null, null, false);
        assertThat(laws).isNotEmpty();
        assertThat(laws).extracting(IcsLawRes::classTreeCode).isSorted();
        assertThat(laws.get(0).tdmCount()).isNotNull(); // 회사 0이면 연결책무 건수
        assertThat(lawService.search(company, tree.get(0).classTreeId(), null, null, false)).isNotEmpty();
        assertThat(lawService.search(company, tree.get(0).classTreeId(), null, null, false).get(0).tdmCount()).isNull();
    }

    @Test
    void 관리자_회사가_아니면_쓰기가_거절되고_빈_코드는_막는다() {
        assertThatThrownBy(() -> treeService.create(company, new ClassTreeSaveReq(0L, "ZT1", "x", null))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> treeService.deleteAll(company, 1L)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> lawService.save(company, List.of(new IcsLawSaveReq(-1L, 1L, "c", "n", null, null, "false")))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> treeService.create(admin, new ClassTreeSaveReq(0L, "", "x", null))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> lawService.save(admin, List.of(new IcsLawSaveReq(-1L, 1L, "c", "", null, null, "false")))).isInstanceOf(BusinessException.class);
    }
}
