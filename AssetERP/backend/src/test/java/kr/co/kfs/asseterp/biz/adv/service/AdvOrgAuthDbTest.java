package kr.co.kfs.asseterp.biz.adv.service;

import kr.co.kfs.asseterp.biz.adv.dto.AccountOrgAuthSearchParam;
import kr.co.kfs.asseterp.biz.adv.dto.OrgAuthBulkReq;
import kr.co.kfs.asseterp.biz.adv.mapper.AdvOrgAuthMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.biz.org.dto.OrgAccountAuthSaveReq;
import kr.co.kfs.asseterp.biz.org.dto.OrgFundAuthRes;
import kr.co.kfs.asseterp.biz.org.dto.OrgFundAuthRow;
import kr.co.kfs.asseterp.biz.org.service.OrgCodeService;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** Q02 일임계좌 권한설정: 일괄 권한(부여·삭제)·조직 권한 트리 저장·조회창 SQL을 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AdvOrgAuthService.class, AdvAccountService.class, OrgCodeService.class})
class AdvOrgAuthDbTest {

    @Autowired AdvOrgAuthService service;
    @Autowired AdvAccountService accountService;
    @Autowired OrgCodeService orgCodeService;
    @Autowired AdvOrgAuthMapper mapper;
    @MockitoBean EmpTransInfoService transInfoService;

    private final UserPrincipal user = UserPrincipal.builder().userId(-1L).companyId(28000L).name("시험자").roles(List.of("ROLE_ADMIN")).build();

    private Long firstAccountId() {
        return accountService.searchAccounts(user, "", 0, 1).rows().get(0).accountId();
    }

    private static AccountOrgAuthSearchParam lookup(long orgId) {
        return new AccountOrgAuthSearchParam(28000L, orgId, "%", 0, 500);
    }

    @Test
    void 일괄_권한부여하면_조회창_SQL에_나오고_권한삭제하면_사라진다() {
        Long accountId = firstAccountId();
        long orgId = 29024L;
        assertThat(mapper.selectByOrgAuthPaging(lookup(orgId))).extracting(a -> a.accountId()).doesNotContain(accountId);

        assertThat(service.updateAuthYn(user, new OrgAuthBulkReq(List.of(accountId), List.of(orgId), "true"))).isEqualTo(1);
        assertThat(mapper.selectByOrgAuthPaging(lookup(orgId))).extracting(a -> a.accountId()).contains(accountId);
        assertThat(mapper.selectByOrgAuthPagingTotal(lookup(orgId))).isGreaterThanOrEqualTo(1);

        // 이미 있는 행은 UPDATE만 한다(행이 늘지 않는다)
        assertThat(service.updateAuthYn(user, new OrgAuthBulkReq(List.of(accountId), List.of(orgId), "false"))).isEqualTo(1);
        assertThat(mapper.selectByOrgAuthPaging(lookup(orgId))).extracting(a -> a.accountId()).doesNotContain(accountId);
    }

    @Test
    void 계좌나_조직이_없으면_거절하고_회사관리자는_조회창이_비어_나온다() {
        assertThatThrownBy(() -> service.updateAuthYn(user, new OrgAuthBulkReq(List.of(), List.of(29024L), "true")))
                .isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.updateAuthYn(user, new OrgAuthBulkReq(List.of(-5L), List.of(29024L), "true")))
                .isInstanceOf(BusinessException.class).hasMessageContaining("일임계좌를 찾을 수 없습니다");
        assertThatThrownBy(() -> service.updateAuthYn(user, new OrgAuthBulkReq(List.of(firstAccountId()), List.of(-5L), "true")))
                .isInstanceOf(BusinessException.class).hasMessageContaining("조직을 찾을 수 없습니다");
        PageRes<?> page = service.searchByOrgAuth(user, "", 0, 500);
        assertThat(page.rows()).isEmpty();
    }

    @Test
    void 조직_권한_트리는_저장하면_바뀐_값으로_다시_읽힌다() {
        Long accountId = firstAccountId();
        List<OrgFundAuthRes> tree = orgCodeService.searchAccountAuthTree(user, accountId);
        assertThat(tree).isNotEmpty();
        assertThat(tree.get(0).depth()).isZero();
        OrgFundAuthRes node = tree.get(0);

        assertThat(orgCodeService.updateAccountAuth(user, new OrgAccountAuthSaveReq(accountId,
                List.of(new OrgFundAuthRow(node.orgAuthId(), node.codeId(), "true"))))).isEqualTo(1);
        OrgFundAuthRes after = orgCodeService.searchAccountAuthTree(user, accountId).stream()
                .filter(n -> n.codeId().equals(node.codeId())).findFirst().orElseThrow();
        assertThat(after.authYn()).isEqualTo("true");
        assertThat(after.orgAuthId()).isPositive();

        // 두 번째 저장은 UPDATE
        assertThat(orgCodeService.updateAccountAuth(user, new OrgAccountAuthSaveReq(accountId,
                List.of(new OrgFundAuthRow(after.orgAuthId(), node.codeId(), null))))).isEqualTo(1);
        assertThat(orgCodeService.searchAccountAuthTree(user, accountId).stream()
                .filter(n -> n.codeId().equals(node.codeId())).findFirst().orElseThrow().authYn()).isEqualTo("false");

        assertThatThrownBy(() -> orgCodeService.updateAccountAuth(user, new OrgAccountAuthSaveReq(-5L, List.of())))
                .isInstanceOf(BusinessException.class);
    }
}
