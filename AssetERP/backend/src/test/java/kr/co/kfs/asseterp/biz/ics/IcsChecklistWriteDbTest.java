package kr.co.kfs.asseterp.biz.ics;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistWriteAnswerReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistWriteCreateReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistWriteFixReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistWriteItem;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistWriteRes;
import kr.co.kfs.asseterp.biz.ics.service.IcsChecklistWriteService;
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

/** K05 내부통제 체크리스트 작성(Ics15_Tab_ChecklistWrite·Ics15_Edit_Reason)의 쓰기를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(IcsChecklistWriteService.class)
class IcsChecklistWriteDbTest {

    @Autowired IcsChecklistWriteService service;

    /** 체크리스트 담당그룹에 공유된 실제 사원(kfstest) — 2026.09 작성 행이 처음엔 하나도 없다 */
    private static final UserPrincipal ME = UserPrincipal.builder().userId(29049L).companyId(28000L).build();
    private static final LocalDate STD_DATE = LocalDate.of(2026, 9, 30);
    private static final String YYYYMM = "2026.09";

    private List<IcsChecklistWriteRes> list(boolean checkBox) {
        return service.list(ME, STD_DATE, "M", null, null, "", checkBox);
    }

    @Test
    void 체크주기는_회사_설정이다() {
        assertThat(service.cycleType(ME)).isEqualTo("M");
    }

    @Test
    void 답변을_체크하고_사유를_적고_제출하고_새로작성으로_지운다() {
        List<IcsChecklistWriteRes> list = list(false);
        assertThat(list).hasSizeGreaterThanOrEqualTo(2);
        assertThat(list).allMatch(r -> r.checklistWriteId() == null && !r.fixYn() && !r.confirmYn());
        long first = list.get(0).checklistId();
        long second = list.get(1).checklistId();

        // 작성내역이 없으면 새로작성(삭제)은 거절된다
        assertThatThrownBy(() -> service.deleteByPersonId(ME, STD_DATE, "M")).isInstanceOf(BusinessException.class)
                .hasMessageContaining("작성내역이 존재하지 않습니다");

        // 답변: 작성 행이 없으면 만들고, 있으면 같은 행의 답변만 바꾼다
        IcsChecklistWriteItem y = service.updateAnswerCode(ME, new IcsChecklistWriteAnswerReq(first, "Y", YYYYMM, "M"));
        assertThat(y.answerCode()).isEqualTo("Y");
        IcsChecklistWriteItem n = service.updateAnswerCode(ME, new IcsChecklistWriteAnswerReq(first, "N", YYYYMM, "M"));
        assertThat(n.checklistWriteId()).isEqualTo(y.checklistWriteId());
        assertThat(n.answerCode()).isEqualTo("N");
        // 미체크 보기: 답변 있는 항목은 빠진다
        assertThat(list(true)).noneMatch(r -> r.checklistId() == first);

        // 사유 창: 작성 행이 없으면 답변 없이 만든다. 사유는 그 행에만 쓴다
        IcsChecklistWriteItem blank = service.create(ME, new IcsChecklistWriteCreateReq(second, YYYYMM, "M"));
        assertThat(blank.answerCode()).isNull();
        assertThat(service.create(ME, new IcsChecklistWriteCreateReq(second, YYYYMM, "M")).checklistWriteId()).isEqualTo(blank.checklistWriteId());
        assertThat(service.updateReason(ME, blank.checklistWriteId(), "시험 사유").reason()).isEqualTo("시험 사유");
        assertThat(service.get(ME, blank.checklistWriteId()).reason()).isEqualTo("시험 사유");

        // 제출 (AS-IS는 제출한 뒤에도 삭제를 막지 않는다 — 확인된 내역만 막는다)
        service.updateFixYn(ME, new IcsChecklistWriteFixReq(true, List.of(n.checklistWriteId(), blank.checklistWriteId())));
        assertThat(list(false)).filteredOn(r -> r.checklistWriteId() != null).allMatch(IcsChecklistWriteRes::fixYn);
        service.updateFixYn(ME, new IcsChecklistWriteFixReq(false, List.of(n.checklistWriteId(), blank.checklistWriteId())));
        assertThat(list(false)).filteredOn(r -> r.checklistWriteId() != null).noneMatch(IcsChecklistWriteRes::fixYn);

        // 새로작성: 이번 달 내 작성 행을 모두 지운다
        assertThat(service.deleteByPersonId(ME, STD_DATE, "M")).isEqualTo(2);
        assertThat(list(false)).allMatch(r -> r.checklistWriteId() == null);
    }

    @Test
    void 검색어와_분류로_좁힌다() {
        List<IcsChecklistWriteRes> all = list(false);
        IcsChecklistWriteRes one = all.get(0);
        assertThat(service.list(ME, STD_DATE, "M", one.checkLClassId(), null, "", false)).allMatch(r -> r.checkLClassId().equals(one.checkLClassId()));
        assertThat(service.list(ME, STD_DATE, "M", null, one.checklistMClassId(), "", false)).allMatch(r -> r.checklistMClassId().equals(one.checklistMClassId()));
        assertThat(service.list(ME, STD_DATE, "M", null, null, "존재하지않는검색어zzz", false)).isEmpty();
    }

    @Test
    void 남의_작성_행은_못_건드린다() {
        long checklist = list(false).get(0).checklistId();
        IcsChecklistWriteItem mine = service.updateAnswerCode(ME, new IcsChecklistWriteAnswerReq(checklist, "Y", YYYYMM, "M"));
        UserPrincipal other = UserPrincipal.builder().userId(999000222L).companyId(28000L).build();

        assertThatThrownBy(() -> service.get(other, mine.checklistWriteId())).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.updateReason(other, mine.checklistWriteId(), "남의 사유")).isInstanceOf(BusinessException.class);
        assertThat(service.updateFixYn(other, new IcsChecklistWriteFixReq(true, List.of(mine.checklistWriteId())))).isZero();
        assertThat(service.get(ME, mine.checklistWriteId()).fixYn()).isFalse();
    }
}
