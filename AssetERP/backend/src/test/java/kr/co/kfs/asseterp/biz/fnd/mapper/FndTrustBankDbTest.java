package kr.co.kfs.asseterp.biz.fnd.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.TrustBankCompanyRes;
import kr.co.kfs.asseterp.biz.fnd.dto.TrustBankCompanySaveReq;
import kr.co.kfs.asseterp.biz.fnd.dto.TrustBankRes;
import kr.co.kfs.asseterp.biz.fnd.dto.TrustBankSaveReq;
import kr.co.kfs.asseterp.biz.fnd.service.DisabledFndIcamImporter;
import kr.co.kfs.asseterp.biz.fnd.service.FndTrustBankService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** D13 수탁은행정보 관리(관리자): 조회와 저장·ICAM가져오기 거절을 asseterpdb에서 돌린다 (읽기만, 쓰기 없음) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({FndTrustBankService.class, DisabledFndIcamImporter.class})
class FndTrustBankDbTest {

    @Autowired FndTrustBankService service;

    private final UserPrincipal admin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private final UserPrincipal company = UserPrincipal.builder().userId(-1L).companyId(28000L).roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 공통회사로_조회하면_공통회사_행만_나오고_다른_회사는_0행이다() {
        List<TrustBankRes> rows = service.search(admin, "", true);
        assertThat(rows).isNotEmpty();
        assertThat(rows).allSatisfy(r -> assertThat(r.companyId()).isZero());
        assertThat(service.search(company, "", true)).isEmpty();
    }

    @Test
    void 저장은_원본에_서비스가_없어_관리자도_거절된다() {
        assertThatThrownBy(() -> service.save(admin, List.of(new TrustBankSaveReq(-1L, "ZT01", "x", "true", null))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("insertCheck");
        assertThatThrownBy(() -> service.save(company, List.of(new TrustBankSaveReq(-1L, "ZT01", "x", "true", null))))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void ICAM가져오기는_관리자_회사만_그리고_연동이_없어_거절된다() {
        assertThatThrownBy(() -> service.importIcam(company)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.importIcam(admin)).isInstanceOf(BusinessException.class).hasMessageContaining("ICAM 연동");
    }

    @Test
    void R12_회사별_수탁은행_조회_등록_중복검사_수정_삭제가_동작한다() {
        List<TrustBankCompanyRes> initial = service.searchCompany(company, "", true);
        assertThat(initial).hasSize(5);

        List<TrustBankCompanyRes> inserted = service.saveCompany(company, List.of(
                new TrustBankCompanySaveReq(-1L, "ZR12", "R12수탁은행", "true", "비고R12", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", null)
        ));
        TrustBankCompanyRes row = inserted.get(0);
        assertThat(row.trustBankId()).isPositive();
        assertThat(row.etcTrustBankCode01()).isEqualTo("B1");
        assertThat(row.etcTrustBankCode09()).isEqualTo("B9");

        // preUpdate: 동일 수탁은행코드 중복 검사
        assertThatThrownBy(() -> service.saveCompany(company, List.of(
                new TrustBankCompanySaveReq(-2L, "ZR12", "중복수탁은행", "true", null, null, null, null, null, null, null, null, null, null, null)
        ))).isInstanceOf(BusinessException.class).hasMessageContaining("동일한 수탁은행코드가 존재합니다.");

        // 수정
        TrustBankCompanyRes updated = service.saveCompany(company, List.of(
                new TrustBankCompanySaveReq(row.trustBankId(), "ZR12", "R12수탁은행수정", "true", "비고수정", "U1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", null)
        )).get(0);
        assertThat(updated.trustBankName()).isEqualTo("R12수탁은행수정");
        assertThat(updated.etcTrustBankCode01()).isEqualTo("U1");

        // 삭제
        service.deleteCompany(company, List.of(row.trustBankId()));
        assertThat(service.searchCompany(company, "ZR12", false)).isEmpty();
    }
}
