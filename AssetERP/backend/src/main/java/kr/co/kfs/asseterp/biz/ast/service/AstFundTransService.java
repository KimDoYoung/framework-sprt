package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.act.service.ActJournalService;
import kr.co.kfs.asseterp.biz.ast.dto.FundTransRes;
import kr.co.kfs.asseterp.biz.ast.dto.FundTransSaveReq;
import kr.co.kfs.asseterp.biz.ast.mapper.AstFundTransMapper;
import kr.co.kfs.asseterp.biz.ast.mapper.AstTrMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.mapper.IcamFeeMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * 이관펀드 등록(사무관리) Ast33_Tab_OfficeMngFundTrans (X28) — AS-IS server/ast/Ast33_FundTrans.java selectByDate(L28) · update(L34) · delete(L145)
 * · Act04_GenLedger.checkClose(클라이언트가 먼저 부르던 회계마감 검사는 서버가 먼저 한다).
 * 이관(출)(1)은 거래유형 9924 거래·분개를 만들고, 이관(입)(2)은 이관일 이전 보수원장을 지운다. 저장·삭제 뒤 보수원장을 정리한다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstFundTransService {

    private static final String TR_CODE = "9924";   // 펀드이관(출)

    private final AstFundTransMapper mapper;
    private final AstTrMapper trMapper;
    private final IcamFeeMapper icamFeeMapper;
    private final ActJournalService journalService;

    /** ast33_fund_trans.selectByDate — 구분 코드 없으면 전체(%), 검색어는 %…% */
    public List<FundTransRes> search(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String fundTransCode, String searchText) {
        if (startDate == null || closeDate == null) throw new BusinessException(ErrorCode.INVALID_INPUT);
        String code = fundTransCode == null || fundTransCode.isBlank() ? "%" : fundTransCode;
        return mapper.selectByDate(user.getCompanyId(), startDate, closeDate, code, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /**
     * ast.Ast33_FundTrans.update — 필수 검사 → 회계마감 → (행마다) 이관(출) 거래·분개 / 이관(입) 이전 보수원장 삭제 → 이관정보 저장 → 보수원장정리.
     * 저장한 행을 다시 읽어 돌려준다
     */
    @Transactional
    public List<FundTransRes> save(UserPrincipal user, FundTransSaveReq req) {
        if (req == null || req.items() == null || req.items().isEmpty()) throw invalid("이관펀드를 등록하세요");
        Long companyId = user.getCompanyId();
        for (FundTransSaveReq.Item r : req.items()) {
            if (r.date() == null) throw invalid("해지일자(이관일자)는 필수입력 항목입니다");
            if (r.corpId() == null) throw invalid("운용사는 필수선택 항목입니다");
            if (r.fundCode() == null || r.fundCode().isEmpty()) throw invalid("펀드코드를 입력하세요");
        }
        journalService.checkClose(companyId, req.items().get(0).date());

        List<FundTransRes> saved = new ArrayList<>();
        for (FundTransSaveReq.Item src : req.items()) {
            Long trId = src.trId();
            // 이관(출): 거래 및 분개 생성 (원본 getForFee() != 0 — 값이 없으면 NullPointerException이라 0으로 본다)
            if ("1".equals(src.fundTransCode()) && src.forFee() != null && src.forFee() != 0) {
                String note = src.fundName() + "(" + src.fundCode() + ")";
                if (src.note() != null && !src.note().isEmpty()) note = note + " " + src.note();
                if (trId != null && trMapper.selectById(companyId, trId) != null) {
                    mapper.updateTr(trId, companyId, user.getUserId(), TR_CODE, src, note);
                } else {
                    List<Long> classTree = mapper.selectTrCodeClassTreeId(companyId, TR_CODE);
                    if (classTree.isEmpty()) {   // 행이 없을 때만 (행은 있고 자산분류ID가 비어 있으면 원본처럼 그대로 진행)
                        throw invalid("거래유형 정보가 등록되어 있지 않습니다. 관리자에게 문의하세요(거래코드:9924)");
                    }
                    trId = mapper.selectNextId();
                    mapper.insertTr(trId, classTree.get(0), companyId, user.getUserId(), TR_CODE, src, note);
                }
                journalService.createJournal(user, trId, TR_CODE, "P", true);
            }
            // 이관(입): 이관일 이전 보수원장 삭제
            if ("2".equals(src.fundTransCode())) {
                mapper.deleteBookFundFeeBeforeHoldDate(companyId, src.date(), src.corpId(), src.fundCode());
            }
            // 이관정보 등록 (UpdateDataModel: ID가 없거나 0 이하면 INSERT)
            FundTransSaveReq.Item item = new FundTransSaveReq.Item(src.fundTransId(), src.fundTransCode(), src.date(), src.corpId(), src.fundCode(),
                    src.fundName(), src.fee(), src.forFee(), src.curCode(), src.note(), trId);
            long id;
            if (src.fundTransId() == null || src.fundTransId() <= 0) {
                id = mapper.selectNextId();
                mapper.insertFundTrans(id, companyId, item);
            } else {
                id = src.fundTransId();
                if (mapper.updateFundTrans(companyId, item) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            rebuildFeeBook(companyId, src.date(), src.corpId(), src.fundCode());
            saved.add(mapper.selectById(companyId, id));
        }
        return saved;
    }

    /** ast.Ast33_FundTrans.delete — 회계마감 → (이관(출)) 승인 전표 검사 → 분개·연결문서·결제·거래 삭제 → 이관정보 삭제 → 보수원장정리 */
    @Transactional
    public void delete(UserPrincipal user, Long fundTransId) {
        Long companyId = user.getCompanyId();
        FundTransRes row = mapper.selectById(companyId, fundTransId);
        if (row == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        journalService.checkClose(companyId, row.date());

        if ("1".equals(row.fundTransCode()) && row.trId() != null) {
            if (trMapper.countFixedJournalByTrId(row.trId()) > 0) throw invalid("승인완료 전표입니다.");
            trMapper.deleteJournalTmpByTrId(row.trId());
            trMapper.deleteJournalDtlByTrId(row.trId());
            trMapper.deleteJournalByTrId(row.trId());
            trMapper.deleteRelateApprByTrId(row.trId());
            trMapper.deleteSettleByTrId(row.trId());
            trMapper.deleteTr(companyId, row.trId());
        }
        mapper.deleteFundTrans(companyId, fundTransId);
        rebuildFeeBook(companyId, row.date(), row.corpId(), row.fundCode());
    }

    /** icam10_fee.createFundFeeBook2 — 'Y'가 아니면 돌려준 메시지로 실패 */
    private void rebuildFeeBook(Long companyId, LocalDate stdDate, Long corpId, String fundCode) {
        String msg = icamFeeMapper.createFundFeeBook2(companyId, stdDate, corpId, fundCode);
        if (!"Y".equals(msg)) throw invalid(msg);
    }

    private BusinessException invalid(String msg) {
        return new BusinessException(ErrorCode.INVALID_INPUT, msg);
    }
}
