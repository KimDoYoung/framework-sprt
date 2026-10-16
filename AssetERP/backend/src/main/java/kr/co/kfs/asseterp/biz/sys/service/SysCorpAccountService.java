package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CorpAccountRes;
import kr.co.kfs.asseterp.biz.sys.dto.CorpAccountSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.CorpRes;
import kr.co.kfs.asseterp.biz.sys.mapper.SysCorpAccountMapper;
import kr.co.kfs.asseterp.biz.sys.mapper.SysCorpMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/sys/Sys17_CorpAccount.java (selectByCorpId L25 / update L33 / delete L47) — 로그인 회사의 거래처 계좌만 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysCorpAccountService {

    private final SysCorpAccountMapper mapper;
    private final SysCorpMapper corpMapper;

    public List<CorpAccountRes> search(UserPrincipal user, Long corpId) {
        requireOwnCorp(user, corpId);
        return mapper.selectByCorpId(corpId);
    }

    /** AS-IS update L33-45: 계좌번호를 암호화(dbConfig.getEncrypts)해 저장 → 저장된 행(요청 순서) */
    @Transactional
    public List<CorpAccountRes> update(UserPrincipal user, Long corpId, List<CorpAccountSaveReq> rows) {
        requireOwnCorp(user, corpId);
        List<CorpAccountRes> saved = new ArrayList<>();
        for (CorpAccountSaveReq in : rows) {
            CorpAccountSaveReq req = new CorpAccountSaveReq(in.corpAccountId(), in.bankCode(), in.accountNoDec(),
                    in.accountName(), in.mainAccountYn() == null ? "false" : in.mainAccountYn());
            String accountNoEnc = mapper.getEncrypts(req.accountNoDec());
            boolean isNew = req.corpAccountId() == null || req.corpAccountId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.corpAccountId();
            if (isNew) {
                mapper.insertCorpAccount(id, corpId, accountNoEnc, req);
            } else if (mapper.updateCorpAccount(corpId, accountNoEnc, req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, Long corpId, List<Long> ids) {
        requireOwnCorp(user, corpId);
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteCorpAccounts(corpId, ids);
    }

    private void requireOwnCorp(UserPrincipal user, Long corpId) {
        CorpRes corp = corpId == null ? null : corpMapper.selectById(corpId);
        if (corp == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!user.getCompanyId().equals(corp.companyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
