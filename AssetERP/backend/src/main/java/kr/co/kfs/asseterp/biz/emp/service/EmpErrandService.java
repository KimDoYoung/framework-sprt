package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.ErrandRes;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpErrandMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** 외출관리 (AS-IS Emp54_Tab_ErrandManager) — 조회만. 1단계: 이익수령 제외신청 상세보기(Apr01_Edit_ApprDoc.retrieveApproval)는 다음 단계 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpErrandService {

    private final EmpErrandMapper mapper;

    /** AS-IS emp.Emp54_Errand.selectByManager — 검색어는 외출자+구분+사유+주최자에 대한 `%검색어%`(대소문자 무시) */
    public List<ErrandRes> search(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String searchText) {
        return mapper.selectByManager(user.getCompanyId(), startDate, closeDate, "%" + (searchText == null ? "" : searchText) + "%");
    }
}
