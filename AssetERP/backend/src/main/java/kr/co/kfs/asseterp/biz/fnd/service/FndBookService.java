package kr.co.kfs.asseterp.biz.fnd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.biz.fnd.dto.BookFundRes;
import kr.co.kfs.asseterp.biz.fnd.dto.BookItemRes;
import kr.co.kfs.asseterp.biz.fnd.dto.BookRelateAstRes;
import kr.co.kfs.asseterp.biz.fnd.dto.BookRelateFndRes;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndBookMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/fnd/Fnd10_Book.java (P09·P10 펀드별 운용자산) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FndBookService {

    private final FndBookMapper mapper;
    private final EmpTransInfoService transInfoService;

    /** AS-IS selectByRelateAst L22 (P09). 회사는 로그인 회사 */
    public List<BookRelateAstRes> searchRelateAst(UserPrincipal user, Long fundCodeId, LocalDate stdDate) {
        return mapper.selectByRelateAst(user.getCompanyId(), fundCodeId, stdDate);
    }

    /** AS-IS selectByRelateFnd L28 (P10). 조직은 LoginUser.getOrgCodeId() — 회사관리자(userId < 0)는 0 */
    public List<BookRelateFndRes> searchRelateFnd(UserPrincipal user, Long astClassTreeId, LocalDate stdDate) {
        Long orgId = user.getUserId() < 0 ? Long.valueOf(0L) : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        return mapper.selectByRelateFnd(user.getCompanyId(), orgId, astClassTreeId, stdDate);
    }

    /** AS-IS selectItemList L34 (EE47). searchText는 AS-IS 화면처럼 "%" + 입력 + "%" */
    public List<BookItemRes> searchItems(UserPrincipal user, LocalDate stdDate, String searchText) {
        return mapper.selectItemList(user.getCompanyId(), stdDate, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS selectFundListByItemCode L40 (EE47) */
    public List<BookFundRes> searchFundsByItem(UserPrincipal user, LocalDate stdDate, String itemCode) {
        return mapper.selectFundListByItemCode(user.getCompanyId(), stdDate, itemCode);
    }
}
