package kr.co.kfs.asseterp.biz.org.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.org.dto.OrgCodeRes;
import kr.co.kfs.asseterp.biz.org.dto.OrgCodeSaveReq;
import kr.co.kfs.asseterp.biz.org.dto.OrgInfoHistRes;
import kr.co.kfs.asseterp.biz.org.service.OrgCodeService;
import kr.co.kfs.asseterp.biz.org.service.OrgInfoHistoryService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** C02 조직정보 등록: 트리 조회·하위조직 등록·이력 저장(INSERT/UPDATE)·삭제를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({OrgCodeService.class, OrgInfoHistoryService.class})
class OrgCodeDbTest {

    @Autowired OrgCodeService codeService;
    @Autowired OrgInfoHistoryService infoService;
    @Autowired JdbcTemplate jdbc;

    private static final long KFSTEST = 28000L;
    private static final LocalDate TODAY = LocalDate.now();
    private final UserPrincipal kfstest = UserPrincipal.builder().userId(-1L).companyId(KFSTEST).roles(List.of("ROLE_ADMIN")).build();
    private final UserPrincipal other = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();

    private OrgCodeRes root() {
        return codeService.searchOrgCodes(kfstest, TODAY).get(0);
    }

    private OrgCodeSaveReq newReq(Long parentCodeId) {
        return new OrgCodeSaveReq(null, "ZZT1", LocalDate.of(2026, 1, 1), "시험개설", null, null, null, "시험조직", null, null,
                parentCodeId, "10", "99", "업무", null, TODAY);
    }

    private OrgCodeSaveReq editReq(OrgCodeRes r, LocalDate modDate, String korNm) {
        return new OrgCodeSaveReq(r.codeId(), r.orgCd(), r.openDate().toLocalDate(), r.openReason(), null, null, r.infoId(), korNm,
                modDate, "변경", r.parentCodeId(), r.levelCd(), r.sortOrder(), r.note(), r.dcrIdWord(), modDate);
    }

    @Test
    void 트리는_전위_순서이고_깊이가_있다() {
        List<OrgCodeRes> list = codeService.searchOrgCodes(kfstest, TODAY);
        assertThat(list).isNotEmpty();
        assertThat(list.get(0).depth()).isEqualTo(1);
        assertThat(list.get(0).parentCodeId()).isZero();
        for (int i = 1; i < list.size(); i++) {
            assertThat(list.get(i).depth()).isLessThanOrEqualTo(list.get(i - 1).depth() + 1);
        }
    }

    @Test
    void 하위조직_등록_수정_이력_삭제() {
        OrgCodeRes root = root();
        OrgCodeRes created = codeService.createOrgCode(kfstest, newReq(root.codeId()));
        assertThat(created.codeId()).isEqualTo(created.infoId());
        assertThat(created.modDate().toLocalDate()).isEqualTo(LocalDate.of(2026, 1, 1)); // 변경일 = 개설일
        assertThat(created.modReason()).isEqualTo("시험개설");
        assertThat(codeService.searchOrgCodes(kfstest, TODAY)).anyMatch(r -> r.codeId().equals(created.codeId()) && r.depth() == root.depth() + 1);

        // 변경일이 같으면 UPDATE
        OrgCodeRes updated = codeService.updateOrgCode(kfstest, created.codeId(), editReq(created, LocalDate.of(2026, 1, 1), "시험조직2"));
        assertThat(updated.korNm()).isEqualTo("시험조직2");
        assertThat(infoService.searchInfos(kfstest, created.codeId())).hasSize(1);

        // 변경일이 바뀌면 새 이력 INSERT
        OrgCodeRes hist = codeService.updateOrgCode(kfstest, created.codeId(), editReq(updated, LocalDate.of(2026, 3, 1), "시험조직3"));
        assertThat(hist.infoId()).isNotEqualTo(created.infoId());
        List<OrgInfoHistRes> infos = infoService.searchInfos(kfstest, created.codeId());
        assertThat(infos).extracting(OrgInfoHistRes::korNm).containsExactly("시험조직3", "시험조직2"); // 변경일 내림차순

        // 같은 변경일 이력이 이미 있으면 막는다
        assertThatThrownBy(() -> codeService.updateOrgCode(kfstest, created.codeId(), editReq(updated, LocalDate.of(2026, 3, 1), "x")))
                .isInstanceOf(BusinessException.class);

        // 상위 조직은 하위가 있어 -1, 새 조직은 1
        assertThat(infoService.deleteCheck(kfstest, root.codeId())).isEqualTo(-1);
        assertThat(infoService.deleteCheck(kfstest, created.codeId())).isEqualTo(1);

        // 이력 1건 삭제 → 조직 전체 삭제
        assertThat(infoService.deleteInfos(kfstest, created.codeId(), List.of(hist.infoId()))).isEqualTo(1);
        infoService.deleteOrg(kfstest, created.codeId());
        assertThat(jdbc.queryForObject("select count(*) from org02_info where org02_code_id = ?", Integer.class, created.codeId())).isZero();
        assertThat(jdbc.queryForObject("select count(*) from org01_code where org01_code_id = ?", Integer.class, created.codeId())).isZero();
    }

    @Test
    void Org01_Code_delete는_이력이_2건_이상이면_그_이력만_지운다() {
        OrgCodeRes created = codeService.createOrgCode(kfstest, newReq(root().codeId()));
        OrgCodeRes hist = codeService.updateOrgCode(kfstest, created.codeId(), editReq(created, LocalDate.of(2026, 3, 1), "시험조직3"));
        assertThat(codeService.deleteOrgCode(kfstest, created.codeId(), hist.infoId())).isEqualTo(1);
        assertThat(infoService.searchInfos(kfstest, created.codeId())).hasSize(1);
    }

    @Test
    void 상위조직_변경_저장은_트리에서_그_아래로_간다() {
        List<OrgCodeRes> list = codeService.searchOrgCodes(kfstest, TODAY);
        OrgCodeRes root = list.get(0);
        OrgCodeRes created = codeService.createOrgCode(kfstest, newReq(root.codeId()));
        OrgCodeRes newParent = list.stream().filter(r -> r.depth() == 2).findFirst().orElseThrow();
        OrgCodeSaveReq r = editReq(created, LocalDate.of(2026, 1, 1), "시험조직");
        OrgCodeSaveReq moved = new OrgCodeSaveReq(r.codeId(), r.orgCd(), r.openDate(), r.openReason(), null, null, r.infoId(), r.korNm(),
                r.modDate(), r.modReason(), newParent.codeId(), r.levelCd(), r.sortOrder(), r.note(), r.dcrIdWord(), TODAY);
        assertThat(codeService.updateOrgCode(kfstest, created.codeId(), moved).parentCodeId()).isEqualTo(newParent.codeId());
        assertThat(codeService.searchOrgCodes(kfstest, TODAY))
                .anyMatch(x -> x.codeId().equals(created.codeId()) && x.parentCodeId().equals(newParent.codeId()) && x.depth() == 3);
    }

    @Test
    void 다른_회사_조직은_막는다() {
        OrgCodeRes root = root();
        assertThat(infoService.searchInfos(other, root.codeId())).isEmpty();
        assertThatThrownBy(() -> infoService.deleteCheck(other, root.codeId())).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> infoService.deleteOrg(other, root.codeId())).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> codeService.updateOrgCode(other, root.codeId(), editReq(root, TODAY, "x"))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> codeService.createOrgCode(other, newReq(root.codeId()))).isInstanceOf(BusinessException.class);
    }
}
