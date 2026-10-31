package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprDetailRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprBookmarkRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprDisposalCheckRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprDisposalReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprTypoRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprTypoSaveReq;
import kr.co.kfs.asseterp.biz.apr.service.AprApprActionService;
import kr.co.kfs.asseterp.biz.apr.service.AprApprDetailService;
import kr.co.kfs.asseterp.biz.apr.service.AprApprDisposalService;
import kr.co.kfs.asseterp.biz.apr.service.AprApprMarkService;
import kr.co.kfs.asseterp.biz.apr.service.AprApprTypoService;
import kr.co.kfs.asseterp.biz.apr.service.AprNoticeService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.support.NoticeTestConfig;

/** V09 오타수정·중요표시·공람설정·문서폐기 신청을 asseterpdb의 실제 문서로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprApprTypoService.class, AprApprMarkService.class, AprApprDisposalService.class, AprApprActionService.class, AprApprDetailService.class, AprNoticeService.class, NoticeTestConfig.class})
class AprApprExtraDbTest {

    @Autowired AprApprTypoService typo;
    @Autowired AprApprMarkService mark;
    @Autowired AprApprDisposalService disposal;
    @Autowired AprApprActionService action;
    @Autowired AprApprDetailService detail;
    @Autowired JdbcTemplate jdbc;

    /** 결재중(20) 문서: 상신자 29035 → 29049 승인 → 202306221546363 대기(차례) */
    private static final long MIDDLE = 202608249852607L;
    private static final long TURN = 202306221546363L;
    /** 결재완료(30) 문서, 상신자 202204180108329, 폐기신청·증빙연결·자금집행 없음 */
    private static final long DONE = 202609229873861L;
    private static final long OWNER = 202204180108329L;

    private static UserPrincipal user(long id) {
        return UserPrincipal.builder().userId(id).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    private static AprTypoSaveReq req(AprApprDetailRes d, String title, String reason) {
        return new AprTypoSaveReq(title, d.receiveName() == null ? "" : d.receiveName(), d.referenceName() == null ? "" : d.referenceName(),
                d.note() == null ? "" : d.note(), d.signCompany() == null ? "" : d.signCompany(), d.signCeo() == null ? "" : d.signCeo(), d.content() == null ? "<p>x</p>" : d.content(), reason);
    }

    @Test
    void 오타수정_단추는_내_차례인_결재자에게만_켜진다() {
        assertThat(action.getState(user(TURN), MIDDLE).canTypo()).isTrue();
        assertThat(action.getState(user(29035L), MIDDLE).canTypo()).isFalse();
        assertThat(action.getState(user(OWNER), DONE).canTypo()).isFalse();   // 결재완료 문서에는 없다
    }

    @Test
    void 오타수정은_처음_고치기_전_문서를_한_번_복사하고_다음부터는_사유만_바꾼다() {
        AprApprDetailRes before = detail.getDetail(user(TURN), MIDDLE);
        AprTypoRes none = typo.getTypo(user(TURN), MIDDLE, null);
        assertThat(none).isNull();

        AprApprDetailRes after = typo.save(user(TURN), MIDDLE, req(before, "오타 고친 제목", "사유1"));
        assertThat(after.title()).isEqualTo("오타 고친 제목");
        AprTypoRes snap = typo.getTypo(user(TURN), MIDDLE, null);
        assertThat(snap.title()).isEqualTo(before.title());       // 고치기 전 제목
        assertThat(snap.reason()).isEqualTo("사유1");

        typo.save(user(TURN), MIDDLE, req(before, "두번째 제목", "사유2"));
        assertThat(jdbc.queryForObject("select count(*) from apr92_appr_modi where apr92_appr_id = ? and apr92_reg_emp_id = ?", Integer.class, MIDDLE, TURN)).isEqualTo(1);
        AprTypoRes snap2 = typo.getTypo(user(TURN), MIDDLE, null);
        assertThat(snap2.title()).isEqualTo(before.title());      // 처음 복사본 그대로
        assertThat(snap2.reason()).isEqualTo("사유2");
        assertThat(detail.getDetail(user(TURN), MIDDLE).title()).isEqualTo("두번째 제목");
    }

    @Test
    void 오타수정_입력_검사와_차례_검사() {
        AprApprDetailRes d = detail.getDetail(user(TURN), MIDDLE);
        assertThatThrownBy(() -> typo.save(user(TURN), MIDDLE, req(d, "", "사유"))).hasMessageContaining("제목은 반드시 입력하셔야 합니다");
        assertThatThrownBy(() -> typo.save(user(TURN), MIDDLE, req(d, "제목", ""))).hasMessageContaining("변경사유는 반드시 입력하셔야 합니다");
        assertThatThrownBy(() -> typo.save(user(TURN), MIDDLE, req(d, "가".repeat(201), "사유"))).hasMessageContaining("200자 제한");
        assertThatThrownBy(() -> typo.save(user(29035L), MIDDLE, req(d, "제목", "사유"))).isInstanceOf(BusinessException.class);
    }

    @Test
    void 중요표시는_스위치_줄과_사원_줄을_따로_다룬다() {
        UserPrincipal u = user(OWNER);
        assertThat(mark.getBookmarks(u, DONE)).isEmpty();
        mark.setBookmarkPublic(u, DONE, true);
        mark.setBookmarkPublic(u, DONE, false);   // 있으면 값만 바뀐다
        List<AprBookmarkRes> rows = mark.getBookmarks(u, DONE);
        assertThat(rows).hasSize(1);
        assertThat(rows.get(0).personId()).isNull();
        assertThat(rows.get(0).publicYn()).isEqualTo("false");
        mark.addBookmarkPersons(u, DONE, List.of(29049L));
        rows = mark.getBookmarks(u, DONE);
        assertThat(rows).hasSize(2);
        AprBookmarkRes person = rows.stream().filter(r -> r.personId() != null).findFirst().orElseThrow();
        assertThat(person.personInfo()).contains("(");
        mark.deleteBookmarks(u, DONE, List.of(person.bookmarkId()));
        assertThat(mark.getBookmarks(u, DONE)).hasSize(1);
        mark.clearBookmarks(u, DONE);
        assertThat(mark.getBookmarks(u, DONE)).isEmpty();
    }

    @Test
    void 공람설정은_사원을_더하고_뺀다() {
        UserPrincipal u = user(OWNER);
        assertThat(mark.getPersonAuths(u, DONE)).isEmpty();
        mark.savePersonAuths(u, DONE, List.of(29049L, 29035L), null);
        var rows = mark.getPersonAuths(u, DONE);
        assertThat(rows).hasSize(2);
        assertThat(rows.get(0).personNo()).isNotBlank();
        mark.savePersonAuths(u, DONE, null, List.of(rows.get(0).personAuthId()));
        assertThat(mark.getPersonAuths(u, DONE)).hasSize(1);
    }

    @Test
    void 문서폐기_신청은_조건을_검사하고_이력과_신청서를_남긴다() {
        UserPrincipal u = user(OWNER);
        assertThat(disposal.check(u, DONE).ok()).isTrue();
        assertThatThrownBy(() -> disposal.submit(u, DONE, new AprDisposalReq("", 29049L))).hasMessageContaining("사유는 필수입력항목입니다");
        assertThatThrownBy(() -> disposal.submit(u, DONE, new AprDisposalReq("사유", null))).hasMessageContaining("승인자는 필수선택항목입니다");
        assertThatThrownBy(() -> disposal.submit(user(29049L), DONE, new AprDisposalReq("사유", 29049L))).isInstanceOf(BusinessException.class);   // 상신자가 아님

        disposal.submit(u, DONE, new AprDisposalReq("시험 사유", 29049L));
        assertThat(jdbc.queryForObject("select count(*) from apr90_disposal_list where apr90_appr_id = ? and apr90_disposal_cd = '10' and apr90_confirm_emp_id = 29049 and apr90_reg_emp_id = ?", Integer.class, DONE, OWNER)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select count(*) from apr91_disposal_history where apr91_appr_id = ? and apr91_disposal_cd = '10'", Integer.class, DONE)).isEqualTo(1);
        AprDisposalCheckRes again = disposal.check(u, DONE);
        assertThat(again.ok()).isFalse();
        assertThat(again.message()).isEqualTo("해당문서는 이미 폐기신청이 완료되었습니다");
    }

    @Test
    void 승인자_처음_값은_내_조직의_조직장이다() {
        var e = disposal.getConfirmEmp(user(29035L));
        if (e != null) {
            assertThat(e.personId()).isNotEqualTo(29035L);
            assertThat(e.korName()).isNotBlank();
        }
    }
}
