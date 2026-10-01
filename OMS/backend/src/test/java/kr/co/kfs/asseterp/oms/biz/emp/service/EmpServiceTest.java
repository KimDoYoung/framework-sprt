package kr.co.kfs.asseterp.oms.biz.emp.service;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.emp.dto.AddTitleRes;
import kr.co.kfs.asseterp.oms.biz.emp.dto.AddTitleSaveReq;
import kr.co.kfs.asseterp.oms.biz.emp.dto.PersonKey;
import kr.co.kfs.asseterp.oms.biz.emp.dto.PersonRes;
import kr.co.kfs.asseterp.oms.biz.emp.dto.TransInfoCreateReq;
import kr.co.kfs.asseterp.oms.biz.emp.mapper.EmpAddTitleMapper;
import kr.co.kfs.asseterp.oms.biz.emp.mapper.EmpPersonMapper;
import kr.co.kfs.asseterp.oms.biz.emp.mapper.EmpTransInfoMapper;
import kr.co.kfs.asseterp.oms.biz.emp.mapper.EmpTransMapper;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class EmpServiceTest {

    private final EmpPersonMapper personMapper = mock(EmpPersonMapper.class);
    private final EmpTransMapper transMapper = mock(EmpTransMapper.class);
    private final EmpAddTitleMapper addTitleMapper = mock(EmpAddTitleMapper.class);
    private final EmpPersonService personService = new EmpPersonService(personMapper, addTitleMapper);
    private final EmpTransService transService = new EmpTransService(transMapper, personService);
    private final EmpAddTitleService addTitleService = new EmpAddTitleService(addTitleMapper, personMapper, transMapper, personService);
    private final EmpTransInfoService transInfoService = new EmpTransInfoService(mock(EmpTransInfoMapper.class), personMapper, transMapper);
    private final UserPrincipal user = UserPrincipal.builder().userId(-1L).companyId(28000L).roles(List.of()).build();
    private static final LocalDate HIRE = LocalDate.of(2020, 3, 2);

    private static AddTitleRes addTitle(String empNo) {
        return new AddTitleRes(1L, 10L, 11L, empNo, HIRE, null, 1L, null, "30", null, "20", null, false, null);
    }

    @Test
    void 파생_사번은_기존_PT_번호_중_가장_큰_수_다음() {
        assertThat(EmpAddTitleService.maxSuffix(List.of())).isZero();
        assertThat(EmpAddTitleService.maxSuffix(List.of(addTitle("101-PT1"), addTitle("101-PT3"), addTitle("101-PT2")))).isEqualTo(3);
    }

    @Test
    void 겸직_등록은_파생_사원과_겸직_발령_800을_만든다() {
        when(personMapper.selectById(new PersonKey(28000L, 10L))).thenReturn(
                new PersonRes(10L, 28000L, "101", "홍길동", HIRE, null, "a@b", null, null, "010", null));
        when(addTitleMapper.searchByPersonId(10L)).thenReturn(List.of(addTitle("101-PT1")));
        when(personMapper.selectNextId()).thenReturn(900L);
        when(transMapper.selectNextId()).thenReturn(901L);
        when(addTitleMapper.selectNextId()).thenReturn(902L);

        addTitleService.createAddTitle(user, 10L, new AddTitleSaveReq(HIRE, null, 5L, "30", "20", true, "사유"));

        verify(personMapper).insert(argThat(r -> r.personId() == 900L && "101-PT2".equals(r.empNo())));
        verify(transMapper).insert(argThat(r -> r.transId() == 901L && r.personId() == 900L && "800".equals(r.transCd()) && "true".equals(r.orgHeadYn())));
        verify(addTitleMapper).insert(argThat(r -> r.addTitleId() == 902L && r.personId() == 10L && r.addPersonId() == 900L));
    }

    @Test
    void 발령은_사원마다_1건_이상_남아야_한다() {
        when(transMapper.selectPersonOfTrans(5L)).thenReturn(10L);
        when(personMapper.selectById(any())).thenReturn(new PersonRes(10L, 28000L, "101", "홍길동", HIRE, null, null, null, null, null, null));
        when(transMapper.countByPerson(10L)).thenReturn(1);
        assertThatThrownBy(() -> transService.deleteTrans(user, 5L)).hasMessageContaining("1(개)이상");
        verify(transMapper, never()).delete(any());
    }

    @Test
    void 신규사원은_입사일을_발령일로_채용발령_100을_넣는다() {
        when(personMapper.selectNextId()).thenReturn(900L);
        when(transMapper.selectNextId()).thenReturn(901L);
        transInfoService.createTransInfo(user, new TransInfoCreateReq(" 999 ", "신입", "10", HIRE, null, null, "010", "a@b", "30", "20", 5L, null));
        verify(personMapper).insert(argThat(r -> r.personId() == 900L && "999".equals(r.empNo()) && r.companyId() == 28000L));
        verify(transMapper).insert(argThat(r -> r.personId() == 900L && HIRE.equals(r.transDate()) && "100".equals(r.transCd())));
    }

    @Test
    void 다른_회사_사원은_찾을_수_없다() {
        when(personMapper.selectById(any())).thenReturn(null);
        assertThatThrownBy(() -> personService.getPerson(user, 10L)).isInstanceOf(BusinessException.class);
    }
}
