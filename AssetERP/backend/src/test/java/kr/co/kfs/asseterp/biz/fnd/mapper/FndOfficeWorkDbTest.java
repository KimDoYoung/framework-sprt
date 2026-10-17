package kr.co.kfs.asseterp.biz.fnd.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.OfficeWorkRes;
import kr.co.kfs.asseterp.biz.fnd.dto.OfficeWorkSaveReq;
import kr.co.kfs.asseterp.biz.fnd.service.DisabledFndIcamImporter;
import kr.co.kfs.asseterp.biz.fnd.service.FndOfficeWorkService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** D12 사무수탁사정보 관리(관리자): 조회·저장(INSERT / UPDATE)·ICAM가져오기 거절을 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({FndOfficeWorkService.class, DisabledFndIcamImporter.class})
class FndOfficeWorkDbTest {

    @Autowired FndOfficeWorkService service;

    private final UserPrincipal admin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private final UserPrincipal company = UserPrincipal.builder().userId(-1L).companyId(28000L).roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 공통회사로_조회하면_공통회사_행만_나오고_다른_회사는_0행이다() {
        List<OfficeWorkRes> rows = service.search(admin, "", true);
        assertThat(rows).isNotEmpty();
        assertThat(rows).allSatisfy(r -> assertThat(r.companyId()).isZero());
        assertThat(rows).extracting(OfficeWorkRes::officeWorkCode).isSorted();
        assertThat(service.search(company, "", true)).isEmpty();
    }

    @Test
    void 저장하면_없는_행은_새_id로_들어가고_있는_행은_고쳐진다() {
        List<OfficeWorkRes> inserted = service.save(admin,
                List.of(new OfficeWorkSaveReq(-1L, "시험사무수탁사", "ZT01", "K01", "S01", "true", "비고1")));
        OfficeWorkRes row = inserted.get(0);
        assertThat(row.officeWorkId()).isPositive();
        assertThat(row.companyId()).isZero();
        assertThat(service.search(admin, "ZT01", true)).extracting(OfficeWorkRes::officeWorkName).containsExactly("시험사무수탁사");

        OfficeWorkRes updated = service.save(admin,
                List.of(new OfficeWorkSaveReq(row.officeWorkId(), "이름은안바뀜", "ZT02", "K02", "S02", "false", "비고2"))).get(0);
        assertThat(updated.officeWorkId()).isEqualTo(row.officeWorkId());
        assertThat(updated.officeWorkCode()).isEqualTo("ZT02");
        assertThat(updated.kofiaCode()).isEqualTo("K02");
        assertThat(updated.etcOfficeWorkCode01()).isEqualTo("S02");
        assertThat(updated.note()).isEqualTo("비고2");
        // 화면이 고치지 않는 이름·사용여부는 그대로
        assertThat(updated.officeWorkName()).isEqualTo("시험사무수탁사");
        assertThat(updated.useYn()).isEqualTo("true");
        assertThat(service.search(admin, "ZT01", true)).isEmpty();
    }

    @Test
    void 관리자_회사가_아니면_저장과_가져오기가_거절된다() {
        assertThatThrownBy(() -> service.save(company, List.of(new OfficeWorkSaveReq(-1L, "x", "ZT03", null, null, "true", null))))
                .isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.importIcam(company)).isInstanceOf(BusinessException.class);
    }

    @Test
    void 관리자_회사의_ICAM가져오기는_연동이_없어_거절된다() {
        assertThatThrownBy(() -> service.importIcam(admin)).isInstanceOf(BusinessException.class).hasMessageContaining("ICAM 연동");
    }
}
