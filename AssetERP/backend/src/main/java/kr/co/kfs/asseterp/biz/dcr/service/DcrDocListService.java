package kr.co.kfs.asseterp.biz.dcr.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocFileCond;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocFileRes;
import kr.co.kfs.asseterp.biz.dcr.mapper.DcrDocListMapper;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.biz.sys.service.SysMenuSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/dcr/Dcr00_DocList.java (F08 문서별 첨부파일 검색) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DcrDocListService {

    private final DcrDocListMapper mapper;
    private final EmpTransInfoService transInfoService;

    /**
     * AS-IS Dcr00_DocList.getFile L197. admin = LoginUser.getIsManager()(회사관리자·관리자 회사)면 조직·문서권한 조건 없이 모두.
     * 조직은 LoginUser.getOrgCodeId() — 회사관리자(userId < 0)는 0. 검색어는 서비스가 %…%로 만든다(빈 글자면 %%)
     */
    public List<DcrDocFileRes> searchFiles(UserPrincipal user, Long classTreeId, LocalDate startDate, LocalDate endDate, String searchText) {
        Long orgId = user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        String admin = String.valueOf(SysMenuSearchService.isManager(user));
        return mapper.selectFiles(new DcrDocFileCond(user.getCompanyId(), classTreeId, orgId, user.getUserId(), admin, startDate, endDate,
                "%" + (searchText == null ? "" : searchText) + "%", "%"));
    }
}
