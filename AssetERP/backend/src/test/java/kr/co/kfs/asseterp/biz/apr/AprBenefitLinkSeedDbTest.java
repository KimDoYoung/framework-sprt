package kr.co.kfs.asseterp.biz.apr;

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
import kr.co.kfs.asseterp.biz.apr.service.link.BenefitLinkSeedProvider;
import kr.co.kfs.asseterp.biz.apr.service.link.FormMappingLinkSeedSupport;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.BenefitRes;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpBenefitMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** V42 A21~A23·A37·A49 복리후생비 신청서 — 신청 행 만들기·제목·본문 치환 값·상신ID·삭제 규칙을 asseterpdb에서 확인한다(테스트 트랜잭션 롤백) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprLinkSeedService.class, BenefitLinkSeedProvider.class, FormMappingLinkSeedSupport.class})
class AprBenefitLinkSeedDbTest {

    @Autowired AprLinkSeedService seedService;
    @Autowired EmpBenefitMapper benefitMapper;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("천영임").roles(List.of("ROLE_USER")).build();
    }

    private long insert(String code, Long amt, LocalDate occ, String detail) {
        long id = benefitMapper.selectNextId();
        benefitMapper.insertBenefit(id, 28000L, LocalDate.now(), code, 29049L, 30422L, amt, occ, detail);
        return id;
    }

    @Test
    void 월단위_신청은_사용월이_제목에_들어간다() {
        long id = insert("010BN", 1234567L, LocalDate.of(2026, 10, 31), null);
        AprLinkSeedRes res = seedService.seed(user(), 30422L, "A21", id, Map.of("yyyy", "2026", "mm", "10"));
        assertThat(res.title()).endsWith(" 지원신청서 (2026년 10월분)_천영임");
        assertThat(res.titleReadOnly()).isFalse();
        assertThat(res.saveVisible()).isFalse();
    }

    @Test
    void 일단위_신청은_발생일자가_제목에_들어간다() {
        long id = insert("020AN", 50000L, LocalDate.of(2026, 9, 3), null);
        AprLinkSeedRes res = seedService.seed(user(), 30422L, "A22", id, Map.of("yyyy", "2026", "mm", "10"));
        assertThat(res.title()).endsWith(" 지원신청서 (2026-09-03)_천영임");
    }

    @Test
    void 지급_상태와_상신ID_삭제_규칙() {
        long id = insert("900BY", 100L, LocalDate.of(2026, 9, 3), "체력단련비");
        BenefitRes row = benefitMapper.selectById(28000L, id);
        assertThat(row.benefitYn()).isEqualTo("false");
        assertThat(row.benefitDetail()).isEqualTo("체력단련비");
        assertThat(benefitMapper.selectByPersonId(28000L, 29049L, LocalDate.now(), LocalDate.now(), "%", "%", "%%")
                .stream().anyMatch(r -> r.benefitId().equals(id))).isTrue();
        assertThat(benefitMapper.updateApprId(28000L, id, 1L)).isEqualTo(1);
        assertThat(benefitMapper.deleteBenefitId(28000L, 1L, id)).isZero(); // 남의 행은 못 지운다
        assertThat(benefitMapper.deleteBenefitId(28000L, 29049L, id)).isEqualTo(1);
    }

    @Test
    void 한글_금액과_없는_행() {
        assertThat(BenefitLinkSeedProvider.toKorean(1234567L)).isEqualTo("일백이십삼만사천오백육십칠");
        assertThat(BenefitLinkSeedProvider.toKorean(100000000L)).isEqualTo("일억");
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 30422L, "A21", 1L, Map.of()));
    }
}
