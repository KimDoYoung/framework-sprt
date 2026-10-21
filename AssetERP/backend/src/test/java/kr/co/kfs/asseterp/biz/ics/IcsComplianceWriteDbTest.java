package kr.co.kfs.asseterp.biz.ics;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceWriteAnswerReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceWriteCreateReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceWriteFixReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceWriteItem;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceWriteRes;
import kr.co.kfs.asseterp.biz.ics.service.IcsComplianceWriteService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** K01 내부통제 준수확인서 작성(Ics31_Tab_ComplianceWrite·Ics31_Edit_Reason)의 쓰기를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(IcsComplianceWriteService.class)
class IcsComplianceWriteDbTest {

    @Autowired IcsComplianceWriteService service;

    /** 실제 사원이 아닌 시험용 사원 ID — 작성 행이 처음엔 하나도 없다 */
    private static final UserPrincipal ME = UserPrincipal.builder().userId(999000111L).companyId(28000L).build();
    private static final LocalDate STD_DATE = LocalDate.of(2026, 9, 30);
    private static final String YYYYMM = "2026.09";

    @Test
    void 체크주기는_회사_설정이다() {
        assertThat(service.cycleType(ME)).isEqualTo("M");
    }

    @Test
    void 답변을_체크하고_사유를_적고_제출하고_새로작성으로_지운다() {
        List<IcsComplianceWriteRes> list = service.list(ME, STD_DATE, "M", false);
        assertThat(list).isNotEmpty();
        assertThat(list).allMatch(r -> r.complianceWriteId() == null && !r.fixYn() && !r.confirmYn());
        long first = list.get(0).complianceId();
        long second = list.get(1).complianceId();

        // 답변: 작성 행이 없으면 만들고, 있으면 같은 행의 답변만 바꾼다
        IcsComplianceWriteItem y = service.updateAnswerCode(ME, new IcsComplianceWriteAnswerReq(first, "Y", YYYYMM, "M"));
        assertThat(y.answerCode()).isEqualTo("Y");
        IcsComplianceWriteItem n = service.updateAnswerCode(ME, new IcsComplianceWriteAnswerReq(first, "N", YYYYMM, "M"));
        assertThat(n.complianceWriteId()).isEqualTo(y.complianceWriteId());
        assertThat(n.answerCode()).isEqualTo("N");
        // 미체크 보기: 답변 있는 항목은 빠진다
        assertThat(service.list(ME, STD_DATE, "M", true)).noneMatch(r -> r.complianceId() == first);

        // 사유 창: 작성 행이 없으면 답변 없이 만든다. 사유는 그 행에만 쓴다
        IcsComplianceWriteItem blank = service.create(ME, new IcsComplianceWriteCreateReq(second, YYYYMM, "M"));
        assertThat(blank.answerCode()).isNull();
        assertThat(service.create(ME, new IcsComplianceWriteCreateReq(second, YYYYMM, "M")).complianceWriteId()).isEqualTo(blank.complianceWriteId());
        assertThat(service.updateReason(ME, blank.complianceWriteId(), "시험 사유").reason()).isEqualTo("시험 사유");
        assertThat(service.get(ME, blank.complianceWriteId()).reason()).isEqualTo("시험 사유");

        // 제출 → 새로작성(삭제)은 막힌다. 제출취소 뒤에는 지워진다
        service.updateFixYn(ME, new IcsComplianceWriteFixReq(true, List.of(n.complianceWriteId(), blank.complianceWriteId())));
        assertThat(service.list(ME, STD_DATE, "M", false)).filteredOn(r -> r.complianceWriteId() != null).allMatch(IcsComplianceWriteRes::fixYn);
        assertThatThrownBy(() -> service.deleteByPersonId(ME, STD_DATE, "M")).isInstanceOf(BusinessException.class)
                .hasMessageContaining("제출취소 후 시도하세요");
        service.updateFixYn(ME, new IcsComplianceWriteFixReq(false, List.of(n.complianceWriteId(), blank.complianceWriteId())));
        assertThat(service.download(ME, STD_DATE, "M", false)).isNotEmpty();
        assertThat(service.deleteByPersonId(ME, STD_DATE, "M")).isEqualTo(2);
        assertThat(service.list(ME, STD_DATE, "M", false)).allMatch(r -> r.complianceWriteId() == null);
    }

    @Test
    void 남의_작성_행은_못_건드린다() {
        long compliance = service.list(ME, STD_DATE, "M", false).get(0).complianceId();
        IcsComplianceWriteItem mine = service.updateAnswerCode(ME, new IcsComplianceWriteAnswerReq(compliance, "Y", YYYYMM, "M"));
        UserPrincipal other = UserPrincipal.builder().userId(999000222L).companyId(28000L).build();

        assertThatThrownBy(() -> service.get(other, mine.complianceWriteId())).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.updateReason(other, mine.complianceWriteId(), "남의 사유")).isInstanceOf(BusinessException.class);
        assertThat(service.updateFixYn(other, new IcsComplianceWriteFixReq(true, List.of(mine.complianceWriteId())))).isZero();
        assertThat(service.get(ME, mine.complianceWriteId()).fixYn()).isFalse();
    }
}
