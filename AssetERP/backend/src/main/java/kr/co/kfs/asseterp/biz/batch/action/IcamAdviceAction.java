package kr.co.kfs.asseterp.biz.batch.action;

import kr.co.kfs.asseterp.biz.batch.dto.BatchAdvAccount;
import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamCompany;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.dto.BatchSysCorp;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchAdviceMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchFundMapper;
import kr.co.kfs.asseterp.biz.batch.service.BatchAction;
import kr.co.kfs.asseterp.biz.batch.service.BatchNoticeLogService;
import kr.co.kfs.asseterp.biz.icam.reader.IcamReader;
import kr.co.kfs.asseterp.biz.icam.reader.IcamRow;
import kr.co.kfs.asseterp.biz.icam.reader.IcamServer;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * AS-IS BatchMain.icamAdvice (L2040) + updateTrCorp (L2144) — 자문 ICAM(ICAM2)의 일임(자문) 계좌를 회사별로 읽어
 * adv02_account에 넣거나 바뀐 것만 고치고, 매매처(증권사) 코드를 sys15_corp(구분 3)에 반영한다.
 * 한 트랜잭션: 실패하면 모두 되돌리고 원인 문구만 알린다(AS-IS).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class IcamAdviceAction implements BatchAction {

    private static final String Q_ACCOUNT = "adv02_account.selectIcamAccount";
    private static final String Q_TR_CORP = "adv02_account.selectIcamTrCorp";
    private static final String CORP_TYPE_SECURITIES = "3";

    private final BatchAdviceMapper adviceMapper;
    private final BatchFundMapper fundMapper;
    private final IcamReader icamReader;
    private final BatchNoticeLogService noticeLog;

    @Override
    public String actionCode() {
        return "icamAdvice";
    }

    @Override
    @Transactional
    public String run(BatchReq req) {
        log.info("ICAM 일임(자문)계좌 가져오기 시작 (icamAdvice) companyId={}, worker={}", req.companyId(), req.worker());
        String companyId = "ALL".equals(req.companyId()) ? "%" : req.companyId();

        try {
            for (BatchIcamCompany company : adviceMapper.selectAdvisCompanies(companyId)) {
                Map<String, Object> param = new HashMap<>();
                param.put("icamCompanyCode", company.icamCompanyCode());

                List<IcamRow> accounts = icamReader.read(IcamServer.ICAM2, Q_ACCOUNT, param);
                List<IcamRow> trCorps = icamReader.read(IcamServer.ICAM2, Q_TR_CORP, param);

                if (accounts.isEmpty()) {
                    noticeLog.notice(actionCode(), "icamAccountList(adv02) size : 0 ", param.toString());
                }

                for (IcamRow r : accounts) {
                    BatchAdvAccount icam = new BatchAdvAccount(null, company.companyId(),
                            r.getString("adv02_manage_cd"), r.getString("adv02_manage_nm"),
                            r.getString("adv02_tr_corp_cd"), r.getString("adv02_tr_corp_nm"),
                            r.getString("adv02_account_no_dec"), r.getDate("adv02_start_date"), r.getDate("adv02_close_date"),
                            req.worker());

                    // 기등록 체크
                    List<BatchAdvAccount> chk = adviceMapper.selectAccountsByManageCode(icam.companyId(), icam.manageCode());
                    if (chk.isEmpty()) {
                        adviceMapper.insertAccount(icam);
                    } else {
                        BatchAdvAccount old = chk.get(0);
                        boolean changed = !Objects.equals(old.manageName(), icam.manageName())
                                || !Objects.equals(old.trCorpCode(), icam.trCorpCode())
                                || !Objects.equals(old.trCorpName(), icam.trCorpName())
                                || !Objects.equals(old.accountNoDec(), icam.accountNoDec())
                                || !Objects.equals(old.startDate(), icam.startDate())
                                || !Objects.equals(old.closeDate(), icam.closeDate());
                        if (changed) {
                            adviceMapper.updateAccount(new BatchAdvAccount(old.accountId(), icam.companyId(), icam.manageCode(),
                                    icam.manageName(), icam.trCorpCode(), icam.trCorpName(), icam.accountNoDec(),
                                    icam.startDate(), icam.closeDate(), icam.worker()));
                        }
                    }
                }

                // 매매처코드 반영
                updateTrCorp(company.companyId(), trCorps);
            }
        } catch (BusinessException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, e.getMessage(), e);
        }
        return "icamAdvice 작업완료..commit";
    }

    /** AS-IS updateTrCorp — 증권사(구분 3) 이름으로 찾아 없으면 넣고, 있으면 코드가 다를 때만 고친다 */
    private void updateTrCorp(Long companyId, List<IcamRow> trCorps) {
        for (IcamRow r : trCorps) {
            String name = r.getString("adv02_tr_corp_nm");
            String code = r.getString("adv02_tr_corp_cd");
            List<BatchSysCorp> corps = adviceMapper.selectCorpsByName(companyId, CORP_TYPE_SECURITIES, name);
            if (corps.isEmpty()) {
                adviceMapper.insertCorp(new BatchSysCorp(fundMapper.selectSeq(), companyId, name, CORP_TYPE_SECURITIES, code));
            } else {
                BatchSysCorp old = corps.get(0);
                if (code != null && !code.equals(old.corpCode())) {
                    adviceMapper.updateCorpCode(new BatchSysCorp(old.corpId(), old.companyId(), old.corpName(), old.corpType(), code));
                }
            }
        }
    }
}
