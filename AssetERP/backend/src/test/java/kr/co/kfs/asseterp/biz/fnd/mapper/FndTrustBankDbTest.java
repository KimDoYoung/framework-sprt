package kr.co.kfs.asseterp.biz.fnd.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
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
}
