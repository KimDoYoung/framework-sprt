package kr.co.kfs.asseterp.biz.bmt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtEmpIctRes;
import kr.co.kfs.asseterp.biz.bmt.mapper.BmtEmpIctMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** 임직원 정보통신수단 (AS-IS Bmt12_Tab_EmpIct → server/bmt/Bmt12_PcHistory) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BmtEmpIctService {

    private static final String WINDOW_CLASS_NAME = "Bmt12_Tab_EmpIct";

    private final BmtEmpIctMapper mapper;

    /** AS-IS bmt.Bmt12_PcHistory.selectEmpICT(companyId, stdDate, searchText = '%' + 글자 + '%') */
    public List<BmtEmpIctRes> search(UserPrincipal user, LocalDate stdDate, String searchText) {
        return mapper.selectEmpIct(user.getCompanyId(), stdDate, like(searchText));
    }

    /** AS-IS Sys99_Print.insertRdEmplct L3957: ① 내 출력 자료 정리 ② 목록을 sys99_print 에 삽입 ③ 새 groupId 반환 */
    @Transactional
    public String insertRdPrint(UserPrincipal user, LocalDate stdDate, String searchText) {
        long groupId = mapper.selectNextId();
        mapper.deletePrint(user.getCompanyId(), user.getUserId(), WINDOW_CLASS_NAME);
        mapper.insertPrint(user.getCompanyId(), user.getUserId(), WINDOW_CLASS_NAME, groupId, stdDate, like(searchText));
        return String.valueOf(groupId);
    }

    private static String like(String searchText) {
        return "%" + (searchText == null ? "" : searchText) + "%";
    }
}
