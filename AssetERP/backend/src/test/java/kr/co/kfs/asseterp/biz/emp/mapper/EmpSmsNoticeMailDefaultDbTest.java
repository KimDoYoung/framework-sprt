package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.apr.mapper.AprNoticeMapper;
import kr.co.kfs.asseterp.biz.emp.dto.SmsNoticeRes;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * 변경반영 CH-0346·0347 — AS-IS 11-11(0be50479f): 메일 알림 기본값(저장한 값이 없을 때)이 M으로 시작하는 필수알림 코드는 false, 그 밖은 true.
 * 로컬 asseterpdb에는 M 코드가 없어 시험 안에서 임시 코드·저장행을 넣는다. @MybatisTest는 시험마다 롤백하므로 DB 데이터는 바뀌지 않는다.
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class EmpSmsNoticeMailDefaultDbTest {

    private static final long PERSON = -1L;   // 저장행이 없는 사원

    @Autowired EmpSmsNoticeMapper noticeMapper;
    @Autowired AprNoticeMapper aprNoticeMapper;
    @Autowired DataSource dataSource;

    private void addCode(JdbcTemplate jdbc, String code) {
        jdbc.update("INSERT INTO sys09_code (sys09_code_id, sys09_code, sys09_name, sys09_seq, sys09_apply_date, sys09_code_kind_id, sys09_company_id) "
                + "SELECT f_create_seq(), ?, '시험 알림', '99', '1910-01-01', sys08_code_kind_id, 0 FROM sys08_code_kind WHERE sys08_kind_cd = 'SmsNoticeCode'", code);
    }

    private void addSaved(JdbcTemplate jdbc, String code) {   // 메일 값이 NULL인 저장행
        jdbc.update("INSERT INTO emp92_sms_notice (emp92_sms_notice_id, emp92_person_id, emp92_sms_notice_cd, emp92_talk_notice_yn, emp92_sms_notice_yn, emp92_mail_notice_yn, emp92_note) "
                + "VALUES (f_create_seq(), ?, ?, 'false', 'true', NULL, NULL)", PERSON, code);
    }

    @Test
    void 메일_기본값은_M코드만_false이고_그_밖은_true다() {
        JdbcTemplate jdbc = new JdbcTemplate(dataSource);
        addCode(jdbc, "M91");

        // 설정 창: 필수알림 탭(M) — 저장행이 없으면 메일 false / 선택알림 탭 — 모두 true
        List<SmsNoticeRes> must = noticeMapper.selectByPersonId(PERSON, "M");
        // 필수알림(M) 코드는 DB 사본마다 다르다 — 넣은 M91이 있고, 모두 M코드이며 메일은 모두 false
        assertThat(must).extracting(SmsNoticeRes::smsNoticeCode).contains("M91").allMatch(c -> c.startsWith("M"));
        assertThat(must).allMatch(r -> Boolean.FALSE.equals(r.mailNoticeYn()));
        List<SmsNoticeRes> optional = noticeMapper.selectByPersonId(PERSON, "");
        assertThat(optional).isNotEmpty().allMatch(r -> !r.smsNoticeCode().startsWith("M") && Boolean.TRUE.equals(r.mailNoticeYn()));
    }

    @Test
    void 메일_발송_차단은_저장행의_NULL을_M코드는_false_그_밖은_true로_본다() {
        JdbcTemplate jdbc = new JdbcTemplate(dataSource);
        addCode(jdbc, "M91");
        addSaved(jdbc, "M91");
        addSaved(jdbc, "A01");

        assertThat(aprNoticeMapper.countMailBlocked(PERSON, "M91")).isEqualTo(1);   // NULL → false → 차단
        assertThat(aprNoticeMapper.countMailBlocked(PERSON, "A01")).isEqualTo(0);   // NULL → true → 차단 아님
    }
}
