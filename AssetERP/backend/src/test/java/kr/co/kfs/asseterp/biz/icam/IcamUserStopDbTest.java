package kr.co.kfs.asseterp.biz.icam;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockMultipartFile;

import kr.co.kfs.asseterp.biz.apr.mapper.AprApprActionMapper;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprWriteMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.IcamStopRes;
import kr.co.kfs.asseterp.biz.icam.dto.IcamStopSaveReq;
import kr.co.kfs.asseterp.biz.icam.dto.IcamUserResultBatchReq;
import kr.co.kfs.asseterp.biz.icam.dto.IcamUserResultRes;
import kr.co.kfs.asseterp.biz.icam.dto.IcamUserSaveReq;
import kr.co.kfs.asseterp.biz.icam.service.IcamUserService;
import kr.co.kfs.asseterp.biz.icam.service.IcamUserStopService;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** EE29~EE31 ICAM 사용자ID 관리(신청서 작성·처리결과 등록·권한정지 신청)를 asseterpdb에서 돌리고 롤백한다(03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({IcamUserService.class, IcamUserStopService.class})
class IcamUserStopDbTest {

    @Autowired IcamUserStopService stop;
    @Autowired IcamUserService users;
    @Autowired JdbcTemplate jdbc;
    @Autowired AprApprActionMapper actionMapper;   // IcamUserService가 쓰는 결재 매퍼가 컨텍스트에 있는지
    @Autowired AprApprWriteMapper writeMapper;

    private final UserPrincipal me = UserPrincipal.builder().userId(29049L).companyId(28000L).roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 권한정지_신청은_저장_검색_상신연결_삭제를_돈다() {
        LocalDate std = LocalDate.of(2099, 3, 31);
        assertThatThrownBy(() -> stop.save(me, List.of(new IcamStopSaveReq(0L, std, "", "u", "n", null)))).isInstanceOf(BusinessException.class).hasMessage("회사명은 필수입력 항목입니다.");
        assertThatThrownBy(() -> stop.save(me, List.of(new IcamStopSaveReq(0L, std, "a", null, "n", null)))).hasMessage("사용자ID는 필수입력 항목입니다.");
        assertThatThrownBy(() -> stop.save(me, List.of(new IcamStopSaveReq(0L, std, "a", "u", "", null)))).hasMessage("사용자명은 필수입력 항목입니다.");

        stop.save(me, List.of(new IcamStopSaveReq(0L, std, "시험회사", "tuser", "시험", "t@t.kr")));
        List<IcamStopRes> rows = stop.search("", std);
        assertThat(rows).hasSize(1);
        IcamStopRes row = rows.get(0);
        assertThat(row.companyName()).isEqualTo("시험회사");
        assertThat(jdbc.queryForObject("select icam55_reg_type || icam55_proc_stop_yn from icam55_icam_user where icam55_icam_user_id = ?", String.class, row.icamUserId())).isEqualTo("2true");
        assertThat(stop.search("없는검색어zzz", std)).isEmpty();

        stop.save(me, List.of(new IcamStopSaveReq(row.icamUserId(), std, "시험회사2", "tuser", "시험", null)));
        assertThat(stop.search("회사2", std)).hasSize(1);

        stop.updateApprIds(List.of(row.icamUserId()), 999L);
        assertThat(jdbc.queryForObject("select icam55_appr_id from icam55_icam_user where icam55_icam_user_id = ?", Long.class, row.icamUserId())).isEqualTo(999L);

        // EE30 처리결과 일괄반영 + EE29 삭제(상신문서가 없는 ID라 폐기 이동은 건너뜀)
        assertThatThrownBy(() -> users.updateResult(me, new IcamUserResultBatchReq(List.of(row.icamUserId()), null, std, null))).hasMessageContaining("선택안함");
        assertThatThrownBy(() -> users.updateResult(me, new IcamUserResultBatchReq(List.of(row.icamUserId()), "1", null, null))).hasMessage("처리일자를 세팅해주세요.");
        users.updateResult(me, new IcamUserResultBatchReq(List.of(row.icamUserId()), "1", std, "메모"));
        List<IcamUserResultRes> results = users.searchResults("", "%", std, std, false);
        assertThat(results).isNotNull();
        assertThat(jdbc.queryForObject("select icam55_proc_state_cd || icam55_proc_emp_id from icam55_icam_user where icam55_icam_user_id = ?", String.class, row.icamUserId())).isEqualTo("129049");

        jdbc.update("update icam55_icam_user set icam55_appr_id = null where icam55_icam_user_id = ?", row.icamUserId());
        users.delete(me, List.of(row.icamUserId()));
        assertThat(stop.search("", std)).isEmpty();
    }

    @Test
    void 엑셀업로드는_같은_사용자를_지우고_다시_넣고_오류는_알린다() throws Exception {
        LocalDate std = LocalDate.of(2099, 6, 30);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (XSSFWorkbook wb = new XSSFWorkbook()) {
            Sheet sheet = wb.createSheet();
            sheet.createRow(0).createCell(0).setCellValue("기준일자");
            for (int i = 1; i <= 2; i++) {
                Row r = sheet.createRow(i);
                r.createCell(0).setCellValue("2099-06-30");
                r.createCell(1).setCellValue("업로드회사");
                r.createCell(2).setCellValue("up" + i);
                r.createCell(3).setCellValue("사용자" + i);
                r.createCell(4).setCellValue("u" + i + "@t.kr");
            }
            wb.write(out);
        }
        MockMultipartFile file = new MockMultipartFile("excelUpload", "x.xlsx", "application/octet-stream", out.toByteArray());
        assertThat(stop.upload(me, file)).isEqualTo(2);
        assertThat(stop.upload(me, file)).isEqualTo(2);   // 같은 사용자는 지우고 다시 넣는다
        assertThat(stop.search("", std)).hasSize(2);
        assertThat(stop.search("", std).get(0).email()).endsWith("@t.kr");
        assertThatThrownBy(() -> stop.upload(me, new MockMultipartFile("excelUpload", "x.xlsx", "application/octet-stream", new byte[0]))).hasMessage("등록할 파일이 전달되지 않았습니다.");
        assertThat(stop.template()).isNotEmpty();
    }
}
