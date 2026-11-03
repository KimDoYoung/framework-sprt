package kr.co.kfs.asseterp.biz.biz.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizFeeAccountRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizFeeAccountSaveReq;
import kr.co.kfs.asseterp.biz.biz.mapper.BizFeeAccountMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** 보수입금계좌 Biz29_Lookup_Account (EE21) — AS-IS server/biz/Biz29_Account */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BizFeeAccountService {

    private final BizFeeAccountMapper mapper;

    /** biz.Biz29_Account.selectBySearchText (L27) — 검색어는 '%…%' */
    public List<BizFeeAccountRes> search(UserPrincipal user, String searchText) {
        return mapper.selectBySearchText(user.getCompanyId(), "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** getSeq (dbConfig.getSeq → f_create_seq()) — 등록 행의 번호 */
    @Transactional
    public long nextId() {
        return mapper.selectNextId();
    }

    /** biz.Biz29_Account.update (L36) — UpdateDataModel: 번호가 이미 있으면 UPDATE, 없으면 INSERT. 저장한 행을 다시 읽어 돌려준다 */
    @Transactional
    public List<BizFeeAccountRes> save(UserPrincipal user, List<BizFeeAccountSaveReq> rows) {
        List<BizFeeAccountRes> saved = new ArrayList<>();
        for (BizFeeAccountSaveReq r : rows) {
            if (mapper.countById(user.getCompanyId(), r.accountId()) > 0) {
                mapper.updateAccount(user.getCompanyId(), r);
            } else {
                mapper.insertAccount(user.getCompanyId(), r);
            }
            saved.add(mapper.selectById(user.getCompanyId(), r.accountId()));
        }
        return saved;
    }

    /** biz.Biz29_Account.delete (L41) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> accountIds) {
        int n = 0;
        for (Long id : accountIds) {
            n += mapper.deleteById(user.getCompanyId(), id);
        }
        return n;
    }
}
