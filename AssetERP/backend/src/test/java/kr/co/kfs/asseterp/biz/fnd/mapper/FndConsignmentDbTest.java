package kr.co.kfs.asseterp.biz.fnd.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.ConsignmentRes;
import kr.co.kfs.asseterp.biz.fnd.dto.ConsignmentSaveReq;
import kr.co.kfs.asseterp.biz.fnd.service.DisabledFndIcamImporter;
import kr.co.kfs.asseterp.biz.fnd.service.FndConsignmentService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** D11 수탁사정보 관리(관리자): 조회·저장(INSERT / UPDATE)·ICAM가져오기 거절을 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({FndConsignmentService.class, DisabledFndIcamImporter.class})
class FndConsignmentDbTest {

    @Autowired FndConsignmentService service;

    private final UserPrincipal admin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private final UserPrincipal company = UserPrincipal.builder().userId(-1L).companyId(28000L).roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 공통회사_전용이라_다른_회사로_조회하면_0행이다() {
        assertThat(service.search(company, "", true)).isEmpty();
    }

    @Test
    void 저장하면_없는_행은_새_id로_들어가고_있는_행은_고쳐진다() {
        List<ConsignmentRes> inserted = service.save(admin, List.of(new ConsignmentSaveReq(-1L, "ZT01", "시험수탁사", "true", "비고1")));
        ConsignmentRes row = inserted.get(0);
        assertThat(row.consignmentId()).isPositive();
        assertThat(row.companyId()).isZero();
        assertThat(service.search(admin, "ZT01", true)).extracting(ConsignmentRes::consignmentName).containsExactly("시험수탁사");

        ConsignmentRes updated = service.save(admin,
                List.of(new ConsignmentSaveReq(row.consignmentId(), "ZT02", "시험수탁사2", "true", "비고2"))).get(0);
        assertThat(updated.consignmentId()).isEqualTo(row.consignmentId());
        assertThat(updated.consignmentCode()).isEqualTo("ZT02");
        assertThat(updated.note()).isEqualTo("비고2");
        assertThat(service.search(admin, "ZT01", true)).isEmpty();

        // 사용여부 false로 고치면 기본 조회(사용여부 체크)에서는 빠지고, 체크를 풀면 보인다
        service.save(admin, List.of(new ConsignmentSaveReq(row.consignmentId(), "ZT02", "시험수탁사2", "false", "비고2")));
        assertThat(service.search(admin, "ZT02", true)).isEmpty();
        assertThat(service.search(admin, "ZT02", false)).hasSize(1);
    }

    @Test
    void 관리자_회사가_아니면_저장과_가져오기가_거절된다() {
        assertThatThrownBy(() -> service.save(company, List.of(new ConsignmentSaveReq(-1L, "ZT03", "x", "true", null))))
                .isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.importIcam(company)).isInstanceOf(BusinessException.class);
    }

    @Test
    void 관리자_회사의_ICAM가져오기는_연동이_없어_거절된다() {
        assertThatThrownBy(() -> service.importIcam(admin)).isInstanceOf(BusinessException.class).hasMessageContaining("ICAM 연동");
    }
}
