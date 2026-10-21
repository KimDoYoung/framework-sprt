package kr.co.kfs.asseterp.biz.flt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.EmpInfoRes;
import kr.co.kfs.asseterp.biz.flt.dto.EmpInfoSettingRes;
import kr.co.kfs.asseterp.biz.flt.mapper.FltEmpMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/** AS-IS server/flt/Flt02_Emp.java (selectByCompanyId L34), Flt01_CompanyStd.selectByDate L36 — J07 임직원매매현황 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FltEmpService {

    private final FltEmpMapper mapper;

    /** AS-IS Flt02_Emp.selectByCompanyId — 기준일 시점 재직 사원별 현황. 검색어는 `%검색어%`(클라이언트가 붙이던 것) */
    public List<EmpInfoRes> searchInfos(UserPrincipal user, String stdDate, String searchText) {
        return mapper.selectEmpInfos(user.getCompanyId(), null, stdDate, like(searchText), false);
    }

    /** AS-IS setGridHidden() — 기준관리의 "연간투자한도 숨김". 기준관리가 없으면 false */
    public EmpInfoSettingRes setting(UserPrincipal user, String stdDate) {
        return new EmpInfoSettingRes(Boolean.TRUE.equals(mapper.selectInvestLimitUnvisible(user.getCompanyId(), stdDate)));
    }

    /** 엑셀다운로드 — AS-IS는 Sys99_Print.insertRdEmpInfo(selectByCompanyId2) + RD 리포트(연간투자한도를 숨기면 Flt02_Rd_EmpInfo2). 같은 조회 결과를 그리드 열 순서로 xlsx에 쓴다 */
    public byte[] downloadInfos(UserPrincipal user, String stdDate, String searchText) {
        boolean hideLimit = setting(user, stdDate).investLimitUnvisibleYn();
        List<String> headers = new ArrayList<>(List.of("본부(부서)", "사원명", "서약서 서명유무", "가족동의서", "계좌건수", "보고주기", "최근보고일"));
        if (!hideLimit) headers.add("연간투자한도");
        headers.addAll(List.of("연간투자금액", "누적투자금액", "월매매회전율(%)", "월간 일평균잔고", "위반건수", "준감인의견"));
        List<List<Object>> rows = new ArrayList<>();
        for (EmpInfoRes r : mapper.selectEmpInfos(user.getCompanyId(), null, stdDate, like(searchText), true)) {
            List<Object> row = new ArrayList<>(Arrays.asList(r.orgName(), r.personName(), r.oathYnName(), r.familyYnName(), r.accountCntStr(),
                    r.checkCycleName(), r.rcntReportDate()));
            if (!hideLimit) row.add(r.yearInvestLimit());
            row.addAll(Arrays.asList(r.yearInvestAmt(), r.totalInvestAmt(), r.turnoverRate(), r.dailyAvg(), r.violateCntStr(), r.note()));
            rows.add(row);
        }
        return FltExcelWriter.write("임직원매매현황", headers, rows);
    }

    private static String like(String text) {
        return "%" + (text == null ? "" : text) + "%";
    }
}
