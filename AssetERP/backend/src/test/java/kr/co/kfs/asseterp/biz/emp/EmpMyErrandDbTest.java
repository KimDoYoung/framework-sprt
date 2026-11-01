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
import kr.co.kfs.asseterp.biz.emp.dto.ErrandCycleReq;
import kr.co.kfs.asseterp.biz.emp.dto.MyErrandRes;
import kr.co.kfs.asseterp.biz.emp.dto.ErrandSaveReq;
import kr.co.kfs.asseterp.biz.emp.dto.ShareAddReq;
import kr.co.kfs.asseterp.biz.emp.dto.ShareSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpMyErrandService;
import kr.co.kfs.asseterp.biz.emp.service.EmpShareService;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** Y04 외출등록 — 그리드 저장·반복등록·공유·삭제 규칙을 asseterpdb에서 확인한다(테스트 트랜잭션 롤백) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({EmpMyErrandService.class, EmpShareService.class})
class EmpMyErrandDbTest {

    @Autowired EmpMyErrandService service;
    @Autowired EmpShareService shareService;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("천영임").roles(List.of("ROLE_USER")).build();
    }

    private static ErrandSaveReq row(Long id, String reason, LocalDate d) {
        return new ErrandSaveReq(id, "1", d, "10:00", "11:00", reason, "본사", "홍길동", null, true);
    }

    private List<MyErrandRes> list(LocalDate from, LocalDate to) {
        return service.search(user(), from, to);
    }

    @Test
    void 저장_수정_공유_삭제() {
        LocalDate d = LocalDate.of(2030, 3, 5);   // 화요일
        MyErrandRes saved = service.save(user(), List.of(row(-1L, "병원", d))).get(0);
        assertThat(saved.errandId()).isPositive();
        assertThat(saved.weekday()).isEqualTo("화요일");
        assertThat(saved.publicYn()).isTrue();
        assertThat(saved.shareInfo()).isEqualTo("전체공개");

        MyErrandRes upd = service.save(user(), List.of(new ErrandSaveReq(saved.errandId(), "1", d, "09:00", "10:00", "치과", "병원", null, "비고", false))).get(0);
        assertThat(upd.reason()).isEqualTo("치과");
        assertThat(upd.publicYn()).isFalse();

        // 공유 창이 외출을 부모로 받는다
        String info = shareService.save(user(), saved.errandId(), new ShareSaveReq(List.of(), List.of(new ShareAddReq("1", 29049L, 1L))));
        assertThat(info).isNotBlank();
        assertThat(shareService.search(user(), saved.errandId())).hasSize(1);

        MyErrandRes pub = service.updatePublic(user(), saved.errandId(), true);
        assertThat(pub.shareInfo()).isEqualTo("전체공개");

        service.delete(user(), List.of(saved.errandId()));
        assertThat(list(d, d)).isEmpty();
        assertThrows(BusinessException.class, () -> service.updateApprId(user(), saved.errandId(), 1L));
    }

    @Test
    void 반복등록_일별_주별() {
        LocalDate d = LocalDate.of(2030, 3, 5);
        // 일별 1일 간격, 3/5~3/8: 첫 행 + 3/6·3/7·3/8
        int n = service.createCycle(user(), new ErrandCycleReq("1", d, "10:00", "11:00", "정기", "본사", "홍길동", "D", 1L, d.plusDays(3), false, 9999));
        assertThat(n).isEqualTo(4);
        assertThat(list(d, d.plusDays(3))).hasSize(4);

        // 주별 월요일(2): 3/11(월)은 첫 일치일이라 건너뛰고 다음 주 3/18부터 들어간다(AS-IS 로직 그대로)
        LocalDate e = LocalDate.of(2030, 3, 11);
        int w = service.createCycle(user(), new ErrandCycleReq("1", e, null, null, "주별", null, null, "W", 1L, e.plusDays(21), false, 2));
        assertThat(w).isEqualTo(4);
    }

    @Test
    void 반복등록_검사() {
        LocalDate d = LocalDate.of(2030, 3, 5);
        assertThrows(BusinessException.class, () -> service.createCycle(user(), new ErrandCycleReq(null, d, null, null, null, null, null, "none", null, null, false, null)));
        assertThrows(BusinessException.class, () -> service.createCycle(user(), new ErrandCycleReq("1", d, null, null, null, null, null, "D", null, null, false, 9999)));
        assertThrows(BusinessException.class, () -> service.createCycle(user(), new ErrandCycleReq("1", d, null, null, null, null, null, "W", 1L, d.plusDays(7), false, 9999)));
    }
}
