package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprDetailRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprNoticeCall;
import kr.co.kfs.asseterp.biz.apr.service.AprApprDetailService;
import kr.co.kfs.asseterp.biz.apr.service.AprNoticeService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.support.NoticeTestConfig;

/** AA01 결재 알림: 누구에게 무엇을 보낼지(plan)를 실제 문서로 확인한다. 읽기만 하고 아무것도 보내지 않는다.
 *  2026-11-12 CH-0312: 원본 98d5afdd6 통합알림(AlertService) — 앱알림·메일·SMS가 같은 문구, SMS는 + 접속 주소 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprNoticeService.class, AprApprDetailService.class, NoticeTestConfig.class})
class AprNoticePlanDbTest {

    @Autowired AprNoticeService notice;
    @Autowired AprApprDetailService detail;
    @Autowired JdbcTemplate jdbc;

    private static final UserPrincipal USER = UserPrincipal.builder().userId(29049L).name("천영임").companyId(28000L).roles(List.of("ROLE_USER")).build();
    /** 상신자 29035 → 29049 승인 → 202306221546363 대기 → 202406201712129 대기 (진행중) */
    private static final long MIDDLE = 202608249852607L;
    /** 상신자 29035 → 결재자 202312071648256 한 명 대기 */
    private static final long SIMPLE = 202609229873969L;
    /** 참조자(30) 둘이 있는 문서 */
    private static final long WITH_REF = 202607319819367L;

    private AprApprDetailRes doc(long id) {
        return detail.getDetail(USER, id);
    }

    private String classTree(AprApprDetailRes d) {
        return jdbc.queryForObject("select f_class_tree_nm_allpath(?)", String.class, d.classTreeId());
    }

    private static final String URL = "\r\n\r\n https://kfstest.k-fs.co.kr:5151/";

    private List<AprNoticeCall> of(List<AprNoticeCall> all, String kind) {
        return all.stream().filter(c -> kind.equals(c.kind())).toList();
    }

    @Test
    void 결재중이면_다음_결재자_한_명에게_앱알림_메일_SMS가_간다() {
        AprApprDetailRes d = doc(MIDDLE);
        List<AprNoticeCall> calls = notice.planAfterConfirm(USER, d, "20");
        String head = "결재문서  '(" + classTree(d) + ") " + d.title() + "' 건";

        // 앱알림·메일: 다음 대기자(김형수)의 이메일, 문구는 "다음 결재자입니다"
        assertThat(of(calls, "talk")).singleElement().satisfies(c -> {
            assertThat(c.to()).isEqualTo("wosawd@k-fs.co.kr");
            assertThat(c.title()).isEqualTo("상신문서 (결재순서)");
            assertThat(c.body()).isEqualTo(head + "의 다음 결재자입니다.");
        });
        assertThat(of(calls, "mail")).singleElement().satisfies(c -> {
            assertThat(c.to()).isEqualTo("wosawd@k-fs.co.kr");
            assertThat(c.title()).isEqualTo("[알림] Asset-ERP");
            assertThat(c.body()).isEqualTo(head + "의 다음 결재자입니다.");
        });
        // SMS: 하이픈을 뺀 번호, 같은 문구 + 회사 주소, 발송 기록용 회사
        assertThat(of(calls, "sms")).singleElement().satisfies(c -> {
            assertThat(c.to()).isEqualTo("01094903029");
            assertThat(c.body()).isEqualTo(head + "의 다음 결재자입니다." + URL);
            assertThat(c.companyId()).isEqualTo(28000L);
        });
        assertThat(calls).hasSize(3);     // 두번째 대기자(202406201712129)에게는 아직 가지 않는다
    }

    @Test
    void 결재완료는_마지막_결재자를_빼고_결재한_사람에게_간다() {
        AprApprDetailRes d = doc(SIMPLE);
        List<AprNoticeCall> calls = notice.planAfterConfirm(USER, d, "30");
        // 마지막 결재자(202312071648256)는 빠지고 상신자(정서현, 번호가 "-"로 비어 있지는 않음)에게만
        assertThat(calls).isNotEmpty().allMatch(c -> !"kimt@k-fs-test.co.kr".equals(c.to()));
        assertThat(of(calls, "talk")).singleElement().satisfies(c -> {
            assertThat(c.to()).isEqualTo("shjung@k-fs.co.kr");
            assertThat(c.title()).isEqualTo("상신문서 (결재완료)");
            assertThat(c.body()).endsWith("건이 결재완료되었습니다.");
        });
        // 상신자 휴대폰 번호에서 하이픈을 뺀 값("-"뿐이면 빈 문자열 — 원본도 같다). 번호는 DB 사본마다 다르니 DB에서 읽는다
        String ownerTel = jdbc.queryForObject("select coalesce(emp01_mobile_telno,'') from apr01_appr join emp01_person on emp01_person_id = apr01_reg_emp_id where apr01_appr_id = ?", String.class, SIMPLE);
        assertThat(of(calls, "sms")).singleElement().satisfies(c -> {
            assertThat(c.to()).isEqualTo(ownerTel.replace("-", ""));
            assertThat(c.body()).endsWith("건이 결재완료되었습니다." + URL);
        });
    }

    @Test
    void 반려는_앱알림_메일_SMS_모두_반려_문구로_간다() {
        AprApprDetailRes d = doc(SIMPLE);
        List<AprNoticeCall> calls = notice.planAfterConfirm(USER, d, "40");
        // 원본 98d5afdd6 전에는 앱알림만 "결재완료"였다(원본-이상한점 1) — 통합알림으로 같은 문구
        assertThat(of(calls, "talk")).singleElement().satisfies(c -> assertThat(c.body()).endsWith("건이 반려되었습니다."));
        assertThat(of(calls, "mail")).singleElement().satisfies(c -> assertThat(c.body()).endsWith("건이 반려되었습니다."));
        assertThat(of(calls, "sms")).singleElement().satisfies(c -> assertThat(c.body()).contains("건이 반려되었습니다."));
    }

    @Test
    void 결재완료는_참조자에게도_간다() {
        AprApprDetailRes d = doc(WITH_REF);
        List<AprNoticeCall> calls = notice.planAfterConfirm(USER, d, "30");
        List<Map<String, Object>> refs = jdbc.queryForList("select e.emp01_email_addr em, e.emp01_mobile_telno mob from apr04_appr_step s join emp01_person e on e.emp01_person_id = s.apr04_step_emp_id where s.apr04_appr_id = ? and s.apr04_step_type_cd = '30' order by s.apr04_seq", WITH_REF);
        assertThat(refs).isNotEmpty();
        Map<String, Object> first = refs.get(0);
        // 원본 98d5afdd6부터 휴대폰이 없는 참조자도 앱알림·메일을 받는다(원본-이상한점 2가 고쳐짐)
        if (first.get("em") != null) {
            assertThat(calls).anyMatch(c -> "talk".equals(c.kind()) && first.get("em").equals(c.to()) && c.title().equals("상신문서 (결재완료)"));
        }
    }

    @Test
    void 승인취소는_취소_전_대기자에게_직전_결재자의_승인취소를_알린다() {
        AprApprDetailRes d = doc(MIDDLE);
        List<AprNoticeCall> calls = notice.planBeforeCancelApproval(USER, d);
        assertThat(of(calls, "talk")).singleElement().satisfies(c -> {
            assertThat(c.to()).isEqualTo("wosawd@k-fs.co.kr");
            assertThat(c.title()).isEqualTo("상신문서 (결재순서)");
            assertThat(c.body()).endsWith("건이 직전 결재자의 승인 취소로 인해 결재가 중단되었습니다.");
        });
        assertThat(of(calls, "sms")).singleElement().satisfies(c -> assertThat(c.body()).contains("건이 직전 결재자의 승인 취소로 인해 결재가 중단되었습니다." + URL));
    }

    @Test
    void 수신설정을_끈_사람에게는_그_종류를_보내지_않는다() {
        // 롤백되는 테스트 안에서만: 김형수의 메일·앱알림·SMS 수신을 모두 끈다
        jdbc.update("insert into emp92_sms_notice (emp92_sms_notice_id, emp92_person_id, emp92_sms_notice_cd, emp92_sms_notice_yn, emp92_mail_notice_yn, emp92_talk_notice_yn) values (f_create_seq(), 202306221546363, 'T011', 'false', 'false', 'false')");
        assertThat(notice.planAfterConfirm(USER, doc(MIDDLE), "20")).isEmpty();
    }
}
