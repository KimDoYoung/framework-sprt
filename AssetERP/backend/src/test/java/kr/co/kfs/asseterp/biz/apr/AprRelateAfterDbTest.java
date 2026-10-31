package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.apr.dto.AprAfterApprSaveReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprAfterFundRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprAfterFundSaveReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprRelateReq;
import kr.co.kfs.asseterp.biz.apr.service.AprApprDetailService;
import kr.co.kfs.asseterp.biz.apr.service.AprApprWriteService;
import kr.co.kfs.asseterp.biz.apr.service.AprNoticeService;
import kr.co.kfs.asseterp.biz.apr.service.AprRelateEditService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.support.NoticeTestConfig;

/** V16 결재완료 뒤 [연관펀드설정]·[연관문서설정]을 asseterpdb에서 돌리고 롤백한다(03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprRelateEditService.class, AprApprDetailService.class, AprApprWriteService.class, AprNoticeService.class, NoticeTestConfig.class})
class AprRelateAfterDbTest {

    @Autowired AprRelateEditService service;
    @Autowired JdbcTemplate jdbc;

    /** 결재완료(30) 문서: 연관펀드 7줄(결재이후 0), 연관문서 있는 문서는 아래 APPR_DOC */
    private static final long DONE = 202505162279689L;
    private static final long APPR_DOC = 202504152263524L;
    /** 결재 전(10) 문서 */
    private static final long ING = 70693L;
    private static final long NEW_FUND = 34366L;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    private static AprApprRelateReq.Fund asReq(AprAfterFundRes r) {
        return new AprApprRelateReq.Fund(r.relateFundId(), r.fundId(), r.printYn(), r.afterYn());
    }

    private int count(String table, String col, long id) {
        return jdbc.queryForObject("select count(*) from " + table + " where " + col + " = ?", Integer.class, id);
    }

    @Test
    void 연관펀드_목록은_문서의_전체_줄이다() {
        List<AprAfterFundRes> rows = service.getAfterFunds(user(), DONE);
        assertThat(rows).hasSize(count("apr03_relate_fund", "apr03_appr_id", DONE));
        assertThat(rows).allSatisfy(r -> assertThat(r.fundCode()).isNotBlank());
    }

    @Test
    void 그대로_확정하면_아무것도_달라지지_않는다() {
        List<AprAfterFundRes> before = service.getAfterFunds(user(), DONE);
        service.saveAfterFunds(user(), DONE, new AprAfterFundSaveReq(before.stream().map(AprRelateAfterDbTest::asReq).toList()));
        assertThat(service.getAfterFunds(user(), DONE)).isEqualTo(before);
    }

    @Test
    void 새_펀드는_결재이후로_들어가고_빼면_지워진다() {
        List<AprAfterFundRes> before = service.getAfterFunds(user(), DONE);
        List<AprApprRelateReq.Fund> req = new ArrayList<>(before.stream().map(AprRelateAfterDbTest::asReq).toList());
        req.add(new AprApprRelateReq.Fund(-1L, NEW_FUND, null, "false")); // 새 줄: 화면이 보낸 afterYn과 관계없이 서버가 true로
        service.saveAfterFunds(user(), DONE, new AprAfterFundSaveReq(req));

        List<AprAfterFundRes> added = service.getAfterFunds(user(), DONE);
        assertThat(added).hasSize(before.size() + 1);
        AprAfterFundRes mine = added.stream().filter(r -> r.fundId() == NEW_FUND).findFirst().orElseThrow();
        assertThat(mine.afterYn()).isEqualTo("true");
        assertThat(mine.printYn()).isEqualTo("false");

        // 결재이후 줄을 빼고 확정하면 지워지고, 원래(결재 중) 줄은 빼도 남는다(AS-IS는 결재이후 줄만 지운다)
        List<AprApprRelateReq.Fund> keepOnly = new ArrayList<>(added.stream().filter(r -> r.fundId() != NEW_FUND).skip(1).map(AprRelateAfterDbTest::asReq).toList());
        service.saveAfterFunds(user(), DONE, new AprAfterFundSaveReq(keepOnly));
        assertThat(service.getAfterFunds(user(), DONE)).isEqualTo(before);
    }

    @Test
    void 연관문서는_통째로_바꾼다() {
        int before = count("apr21_relate_appr", "apr21_appr_id", APPR_DOC);
        List<AprApprRelateReq.Appr> rows = jdbc.query("select apr21_relate_appr_id, apr21_targer_appr_id from apr21_relate_appr where apr21_appr_id = ? order by 1",
                (rs, i) -> new AprApprRelateReq.Appr(rs.getLong(1), rs.getLong(2)), APPR_DOC);
        List<AprApprRelateReq.Appr> req = new ArrayList<>(rows);
        req.add(new AprApprRelateReq.Appr(-1L, DONE));
        service.saveAfterApprs(user(), APPR_DOC, new AprAfterApprSaveReq(req));
        assertThat(count("apr21_relate_appr", "apr21_appr_id", APPR_DOC)).isEqualTo(before + 1);

        service.saveAfterApprs(user(), APPR_DOC, new AprAfterApprSaveReq(List.of()));
        assertThat(count("apr21_relate_appr", "apr21_appr_id", APPR_DOC)).isZero();
    }

    @Test
    void 결재완료가_아닌_문서와_없는_문서는_거절한다() {
        assertThatThrownBy(() -> service.saveAfterFunds(user(), ING, new AprAfterFundSaveReq(List.of()))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.saveAfterApprs(user(), ING, new AprAfterApprSaveReq(List.of()))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.saveAfterFunds(user(), -1L, new AprAfterFundSaveReq(List.of()))).isInstanceOf(BusinessException.class);
    }
}
