package kr.co.kfs.asseterp.biz.emp;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.MyTransportApprCreateRes;
import kr.co.kfs.asseterp.biz.emp.dto.MyTransportRes;
import kr.co.kfs.asseterp.biz.emp.dto.MyTransportSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpMyTransportService;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** Y07 여비교통비 신청 — 저장·복사·삭제·신청서·검사 규칙을 asseterpdb에서 확인한다(테스트 트랜잭션 롤백) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(EmpMyTransportService.class)
class EmpMyTransportDbTest {

    private static final String YM = "2030.03";

    @Autowired EmpMyTransportService service;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("천영임").roles(List.of("ROLE_USER")).build();
    }

    private static MyTransportSaveReq req(Long id, String start, Long amt) {
        return new MyTransportSaveReq(id, YM, LocalDate.of(2030, 3, 5), start, "본사", "18:00", "18:40", amt, "01", null);
    }

    @Test
    void 저장_수정_복사_삭제() {
        MyTransportRes a = service.save(user(), List.of(req(-1L, "여의도", 12000L))).get(0);
        assertThat(a.transportExpenseId()).isPositive();
        assertThat(a.yyyymm()).isEqualTo(YM);
        assertThat(a.transportName()).isEqualTo("택시");
        assertThat(a.receiptStr()).isEmpty();

        MyTransportRes upd = service.save(user(), List.of(new MyTransportSaveReq(a.transportExpenseId(), YM, a.date(), "광화문", "본사", "18:00", "18:40", 9000L, "02", "비고"))).get(0);
        assertThat(upd.startPoint()).isEqualTo("광화문");
        assertThat(upd.amt()).isEqualTo(9000L);

        // 복사 = 같은 값의 새 행
        MyTransportRes copy = service.save(user(), List.of(req(null, "광화문", 9000L))).get(0);
        assertThat(copy.transportExpenseId()).isNotEqualTo(a.transportExpenseId());
        assertThat(service.search(user(), YM)).hasSize(2);

        service.delete(user(), List.of(a.transportExpenseId(), copy.transportExpenseId()));
        assertThat(service.search(user(), YM)).isEmpty();
    }

    @Test
    void 필수검사와_기준년월() {
        assertThrows(BusinessException.class, () -> service.save(user(), List.of(req(-1L, null, 1000L))));
        assertThrows(BusinessException.class, () -> service.save(user(), List.of(req(-1L, "여의도", null))));
        assertThrows(BusinessException.class, () -> service.search(user(), "2030-03"));
    }

    @Test
    void 신청서_상신상태() {
        assertThat(service.getAppr(user(), YM)).isNull();
        assertThat(service.isClosed(user(), YM)).isFalse();
        MyTransportApprCreateRes c = service.createAppr(user(), YM, 21000L);
        assertThat(c.regNo()).isNotBlank();
        assertThat(service.getAppr(user(), YM).relateApprId()).isEqualTo(c.relateApprId());
        assertThat(service.getAppr(user(), YM).statusCode()).isNull();   // 상신 전
        service.updateApprId(user(), c.relateApprId(), 1L);
        // 다시 만들면 새 ID
        MyTransportApprCreateRes c2 = service.createAppr(user(), YM, 5000L);
        assertThat(c2.relateApprId()).isNotEqualTo(c.relateApprId());
    }
}
