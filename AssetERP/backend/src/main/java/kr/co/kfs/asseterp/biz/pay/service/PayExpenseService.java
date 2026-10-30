package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseDepositReq;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseNewRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseRequestRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseSettleApprRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseSettleApprRowRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseSettlePrintReq;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseSettleInitRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseSettleRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseSettleSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseUpdateReq;
import kr.co.kfs.asseterp.biz.pay.mapper.PayExpenseMapper;
import kr.co.kfs.asseterp.biz.sys.dto.FileRes;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

/** AS-IS server/pay/Pay50_Expense.java (selectExpenseAppr L73·selectExpenseRequest L79·selectById L40 …) — 지출결의서(경영관리) U03 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayExpenseService {

    private final PayExpenseMapper mapper;
    private final SysFileService fileService;

    private static String like(String text) {
        return "%" + (text == null ? "" : text) + "%";
    }

    /** pay50_expense.selectExpenseAppr — 코드 인자는 콤보의 "전체"가 '%' */
    public List<ExpenseRes> search(UserPrincipal user, LocalDate startDate, LocalDate closeDate, boolean statusCheckYn,
                                   String expenseCode, String payMethodCode, String searchText, boolean managerYn, Integer limit) {
        return mapper.selectExpenseAppr(user.getCompanyId(), user.getUserId(), startDate, closeDate, statusCheckYn,
                expenseCode == null ? "%" : expenseCode, payMethodCode, like(searchText), managerYn, limit);
    }

    /** pay50_expense.selectExpenseRequest */
    public List<ExpenseRequestRes> requests(UserPrincipal user, String searchText) {
        return mapper.selectExpenseRequest(user.getCompanyId(), like(searchText));
    }

    /** pay50_expense.selectById */
    public ExpenseRes get(UserPrincipal user, Long expenseId) {
        ExpenseRes row = mapper.selectById(user.getCompanyId(), expenseId);
        if (row == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return row;
    }

    /** AS-IS update (UpdateDataModel) → 저장된 행. 다른 회사의 행은 고칠 수 없다(TOBE 추가) */
    @Transactional
    public ExpenseRes update(UserPrincipal user, Long expenseId, ExpenseUpdateReq req) {
        if (mapper.update(user.getCompanyId(), expenseId, req) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return get(user, expenseId);
    }

    /**
     * AS-IS initExpense L301-349 — 삭제 버튼. 상신 진행·완료, 회계처리 완료면 거절, 화환신청(20)·PASS(80)는 행과 증빙자료를 지우고 나머지는 결의자·반려·상신 연결만 비운다.
     * 한 건이라도 거절되면 전체를 되돌린다(AS-IS는 앞 건이 이미 처리된 채 멈췄다)
     */
    @Transactional
    public int init(UserPrincipal user, List<Long> ids) {
        Long companyId = user.getCompanyId();
        for (Long id : ids) {
            ExpenseRes row = get(user, id);
            //지출결의서 상신상태 체크
            String status = row.expenseApprId() == null ? null : mapper.selectApprStatusCode(row.expenseApprId());
            if (status != null && Set.of("10", "20", "30").contains(status)) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "진행중 또는 완료된 상신내역이 존재합니다.");
            }
            //회계처리여부 체크 (비품등록 체크 trId는 이 화면의 목록 행에는 없는 값이라 AS-IS에서도 걸리지 않는다)
            if (row.journalId() != null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "회계처리가 완료된 내역이 존재합니다. 회계처리 취소 후 삭제하세요");
            }
            //(20:화환신청)이면 delete, 승인상태가 (80:PASS)이면 delete
            if ("20".equals(row.expenseCode()) || "80".equals(row.confirmStatusCode())) {
                mapper.deleteById(companyId, id);
                //증빙자료 삭제
                for (FileRes file : fileService.searchByParentId(id)) {
                    fileService.delete(file.fileId());
                }
            } else {
                mapper.initExpense(companyId, id);
            }
        }
        return ids.size();
    }

    /** AS-IS updateRejectReason L506-517 — 사유가 null이면 반려취소(updateReject 같은 서비스) */
    @Transactional
    public int reject(UserPrincipal user, List<Long> ids, String rejectReason) {
        for (Long id : ids) {
            mapper.updateRejectReason(user.getCompanyId(), id, rejectReason);
        }
        return ids.size();
    }

    /**
     * AS-IS updateApprEmpId L139-209 — [지출요청내역 가져오기]. 화환신청(20)은 사업비요청내역을 새로 만들고 화환 증빙자료를 복사하며,
     * 그 밖에는 결의자만 채운다. 행 값은 화면이 보낸 것을 쓰되 회사는 로그인 회사로 고정한다
     */
    @Transactional
    public int takeRequests(UserPrincipal user, List<ExpenseRequestRes> rows) {
        Long apprEmpId = user.getUserId();
        Long companyId = user.getCompanyId();
        for (ExpenseRequestRes row : rows) {
            if ("20".equals(row.expenseCode())) {
                Long expenseId = mapper.selectNextId();
                mapper.insertRequest(expenseId, companyId, row, apprEmpId);
                //화환신청 증빙자료
                for (FileRes file : fileService.searchByParentId(row.floralId())) {
                    fileService.copyToParent(user, file.fileId(), expenseId);
                }
            } else if (mapper.updateApprEmpId(companyId, row.expenseId(), apprEmpId) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
        }
        return rows.size();
    }

    // ── U07 자금집행결의서 작성(Pay50_Tab_ExpensePayWrite) · U08 조회(Pay50_Tab_ExpensePay) ──

    private static final String PRINT_WINDOW = "Pay50_Tab_ExpensePay";

    /** pay50_expense.selectExpensePay — 코드 인자는 콤보의 "전체"가 '%' */
    public List<ExpenseSettleRes> searchSettles(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String expenseCode,
                                                String payYnCode, boolean statusCheckYn, String searchText) {
        return mapper.selectExpensePay(user.getCompanyId(), startDate, closeDate, expenseCode == null ? "%" : expenseCode,
                payYnCode == null ? "%" : payYnCode, statusCheckYn, like(searchText));
    }

    /** pay50_expense.selectNewExpenseAppr — 이 화면은 targetType = SETTLE */
    public List<ExpenseNewRes> newSettles(UserPrincipal user, String expenseCode, String searchText) {
        return mapper.selectNewExpenseAppr(user.getCompanyId(), "SETTLE", expenseCode, like(searchText));
    }

    /**
     * AS-IS updateSettleEmpId L241-299 — [자금집행 예정내역 가져오기]. 이미 지출결의서 행이면 자금집행자만 채우고,
     * 아니면(복리후생·여비교통 등 예정내역) 새 행으로 넣는다. 세금/4대보험 발생회계(trId)가 있으면 expense_id를 연결한다
     */
    @Transactional
    public int takeSettles(UserPrincipal user, List<ExpenseNewRes> rows) {
        Long settleEmpId = user.getUserId();
        Long companyId = user.getCompanyId();
        for (ExpenseNewRes row : rows) {
            Long expenseId = row.expenseId();
            if (mapper.selectById(companyId, expenseId) != null) {
                mapper.updateSettleEmpId(companyId, expenseId, settleEmpId);
            } else {
                expenseId = mapper.selectNextId();
                mapper.insertExpense(expenseId, companyId, row, settleEmpId);
            }
            //ast06_tr_id 존재시 expense_id UPDATE
            if (row.trId() != null) {
                mapper.updateTrExpenseId(companyId, row.trId(), expenseId);
            }
        }
        return rows.size();
    }

    /** AS-IS update (UpdateDataModel) — [저장]. 다른 회사의 행은 고칠 수 없다(TOBE 추가) */
    @Transactional
    public int saveSettles(UserPrincipal user, List<ExpenseSettleSaveReq> rows) {
        for (ExpenseSettleSaveReq row : rows) {
            if (mapper.updateSettle(user.getCompanyId(), row) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
        }
        return rows.size();
    }

    /** AS-IS updateDeposit L456-472 — [일괄저장] */
    @Transactional
    public int updateDeposit(UserPrincipal user, ExpenseDepositReq req) {
        for (Long id : req.ids()) {
            mapper.updateDepositId(user.getCompanyId(), id, req.settleDate(), req.depositId());
        }
        return req.ids().size();
    }

    /**
     * AS-IS initExpenseSettle L351-392 — [삭제]. 집행결의서 상신이 진행·완료(10·20·30)이거나 미지급반제가 있으면 거절,
     * 10·20·90·91 구분과 전표가 있는 건은 자금집행 값만 비우고 전표가 없는 그 밖의 구분은 행을 지운다.
     * 한 건이라도 거절되면 전체를 되돌린다(AS-IS는 앞 건이 이미 처리된 채 멈췄다)
     */
    @Transactional
    public int initSettles(UserPrincipal user, List<Long> ids) {
        Long companyId = user.getCompanyId();
        for (Long id : ids) {
            ExpenseSettleInitRes row = mapper.selectSettleInitInfo(companyId, id);
            if (row == null) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            //자금집행결의서 상신상태 체크
            String status = row.settleApprId() == null ? null : mapper.selectApprStatusCode(row.settleApprId());
            if (status != null && Set.of("10", "20", "30").contains(status)) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "진행중 또는 완료된 상신내역이 존재합니다.");
            }
            //미지급반제 체크
            if (mapper.countSettleByExpenseId(id) != 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "미지급반제처리 내역이 존재합니다.");
            }
            //(10:사업비요청/20:화환신청/90:기타출금/91:기타출금(선급))이면 초기화, 그 밖은 전표가 있으면 초기화·없으면 delete
            if ((row.expenseCode() != null && Set.of("10", "20", "90", "91").contains(row.expenseCode())) || row.journalId() != null) {
                mapper.initExpenseSettle(companyId, id);
            } else {
                mapper.deleteById(companyId, id);
            }
        }
        return ids.size();
    }

    /**
     * AS-IS Sys99_Print.insertRdExpensePay L4288-4340 — [엑셀다운로드] RD 출력 자료. 내 출력 자료를 지우고 현재 조회 조건의 목록을 한 줄씩 넣는다.
     * 돌려주는 값 = 그룹 ID(RD 리포트의 rdGroupId)
     */
    @Transactional
    public String printSettles(UserPrincipal user, ExpenseSettlePrintReq req) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        long groupId = mapper.selectNextId();
        mapper.deletePrint(companyId, personId, PRINT_WINDOW);
        for (ExpenseSettleRes row : searchSettles(user, req.startDate(), req.closeDate(), req.expenseCode(), req.payYnCode(),
                req.statusCheckYn(), req.searchText())) {
            mapper.insertSettlePrint(mapper.selectNextId(), companyId, personId, PRINT_WINDOW, groupId, row,
                    Boolean.TRUE.equals(row.payYn()) ? "✓" : " ");
        }
        return String.valueOf(groupId);
    }

    /** pay50_expense.selectBySettleDate */
    public List<ExpenseSettleApprRes> searchBySettleDate(UserPrincipal user, LocalDate startDate, LocalDate closeDate,
                                                         boolean statusCheckYn, String searchText) {
        return mapper.selectBySettleDate(user.getCompanyId(), startDate, closeDate, statusCheckYn, like(searchText));
    }

    /** pay50_expense.selectBySettleApprId */
    public List<ExpenseSettleApprRowRes> searchBySettleApprId(UserPrincipal user, Long settleApprId) {
        return mapper.selectBySettleApprId(user.getCompanyId(), settleApprId);
    }

    /** AS-IS updateContent L519-529 */
    @Transactional
    public void updateContent(UserPrincipal user, Long expenseId, String content) {
        if (mapper.updateContent(user.getCompanyId(), expenseId, content) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }
}
