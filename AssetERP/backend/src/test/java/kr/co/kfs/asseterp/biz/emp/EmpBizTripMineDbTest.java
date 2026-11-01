package kr.co.kfs.asseterp.biz.emp;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import kr.co.kfs.asseterp.biz.apr.dto.AprLinkSeedRes;
import kr.co.kfs.asseterp.biz.apr.service.AprLinkSeedService;
import kr.co.kfs.asseterp.biz.apr.service.link.BizTripLinkSeedProvider;
import kr.co.kfs.asseterp.biz.apr.service.link.FormMappingLinkSeedSupport;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.MyBizTripRes;
import kr.co.kfs.asseterp.biz.emp.dto.MyBizTripSaveReq;
import kr.co.kfs.asseterp.biz.emp.dto.ShareAddReq;
import kr.co.kfs.asseterp.biz.emp.dto.ShareRes;
import kr.co.kfs.asseterp.biz.emp.dto.ShareSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpBizTripService;
import kr.co.kfs.asseterp.biz.emp.service.EmpShareService;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** V43 Y05 출장품의 및 결과보고 — 등록·수정·결재ID·공유·삭제 규칙을 asseterpdb에서 확인한다(테스트 트랜잭션 롤백) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({EmpBizTripService.class, EmpShareService.class, AprLinkSeedService.class, BizTripLinkSeedProvider.class, FormMappingLinkSeedSupport.class})
class EmpBizTripMineDbTest {

    @Autowired EmpBizTripService service;
    @Autowired EmpShareService shareService;
    @Autowired AprLinkSeedService seedService;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("천영임").roles(List.of("ROLE_USER")).build();
    }

    private static MyBizTripSaveReq req(String dest) {
        return new MyBizTripSaveReq(LocalDate.of(2026, 11, 3), LocalDate.of(2026, 11, 5), "1", dest, "업무 협의", "2", "홍길동", null, true);
    }

    @Test
    void 등록_수정_조회_삭제() {
        MyBizTripRes row = service.create(user(), req("부산"));
        assertThat(row.bizTripId()).isNotNull();
        assertThat(row.destination()).isEqualTo("부산");
        assertThat(row.publicYn()).isTrue();
        assertThat(row.shareInfo()).isEqualTo("전체공개");
        assertThat(row.apprStatusCode()).isNull();

        MyBizTripRes upd = service.update(user(), row.bizTripId(), new MyBizTripSaveReq(LocalDate.of(2026, 11, 3), LocalDate.of(2026, 11, 6), "2", "도쿄", "해외 미팅", null, null, "비고", false));
        assertThat(upd.destination()).isEqualTo("도쿄");
        assertThat(upd.bizTripCode()).isEqualTo("2");
        assertThat(upd.publicYn()).isFalse();

        List<MyBizTripRes> list = service.searchMine(user(), LocalDate.of(2026, 1, 1), LocalDate.of(2026, 12, 31), "도쿄");
        assertThat(list).extracting(MyBizTripRes::bizTripId).contains(row.bizTripId());

        service.delete(user(), List.of(row.bizTripId()));
        assertThrows(BusinessException.class, () -> service.update(user(), row.bizTripId(), req("x")));
    }

    @Test
    void 필수값_검사_메시지() {
        BusinessException e = assertThrows(BusinessException.class,
                () -> service.create(user(), new MyBizTripSaveReq(null, null, "1", "a", "b", null, null, null, true)));
        assertThat(e.getMessage()).contains("출장기간은 필수작성 항목입니다");
        e = assertThrows(BusinessException.class, () -> service.create(user(), new MyBizTripSaveReq(LocalDate.now(), LocalDate.now(), "", "a", "b", null, null, null, true)));
        assertThat(e.getMessage()).contains("출장구분은 필수선택 항목입니다");
        e = assertThrows(BusinessException.class, () -> service.create(user(), new MyBizTripSaveReq(LocalDate.now(), LocalDate.now(), "1", "", "b", null, null, null, true)));
        assertThat(e.getMessage()).contains("출장지는 필수작성 항목입니다");
        e = assertThrows(BusinessException.class, () -> service.create(user(), new MyBizTripSaveReq(LocalDate.now(), LocalDate.now(), "1", "a", "", null, null, null, true)));
        assertThat(e.getMessage()).contains("출장목적은 필수작성 항목입니다");
    }

    @Test
    void 결재ID_기록과_링크코드_제목() {
        MyBizTripRes row = service.create(user(), req("대전"));
        service.updateApprId(user(), row.bizTripId(), 111L, false);
        service.updateApprId(user(), row.bizTripId(), 222L, true);
        MyBizTripRes after = service.searchMine(user(), LocalDate.of(2026, 1, 1), LocalDate.of(2026, 12, 31), "대전").stream()
                .filter(r -> r.bizTripId().equals(row.bizTripId())).findFirst().orElseThrow();
        assertThat(after.apprId()).isEqualTo(111L);
        assertThat(after.resultApprId()).isEqualTo(222L);

        AprLinkSeedRes seed = seedService.seed(user(), 30422L, "B11", row.bizTripId(), Map.of());
        assertThat(seed.title()).endsWith(" 승인 요청의 건 - 대전");
        AprLinkSeedRes seed2 = seedService.seed(user(), 30422L, "B12", row.bizTripId(), Map.of());
        assertThat(seed2.title()).endsWith(" 결과 보고 - 대전");
    }

    @Test
    void 공유지정_저장과_공유명() {
        MyBizTripRes row = service.create(user(), req("광주"));
        service.updateShare(user(), row.bizTripId(), false);
        String info = shareService.save(user(), row.bizTripId(), new ShareSaveReq(List.of(), List.of(new ShareAddReq("2", null, 1L), new ShareAddReq("1", 29049L, 1L))));
        assertThat(info).contains(" 외 1");
        List<ShareRes> shares = shareService.search(user(), row.bizTripId());
        assertThat(shares).hasSize(2);
        assertThat(shares.get(0).shareCode()).isEqualTo("1");  // ORDER BY emp56_share_cd

        String info2 = shareService.save(user(), row.bizTripId(), new ShareSaveReq(List.of(shares.get(0).shareId()), List.of()));
        assertThat(info2).doesNotContain(" 외 ");
        assertThat(shareService.search(user(), row.bizTripId())).hasSize(1);
        assertThrows(BusinessException.class, () -> shareService.search(user(), 1L));  // 남의 출장·없는 출장
    }
}
