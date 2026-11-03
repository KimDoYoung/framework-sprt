package kr.co.kfs.asseterp.biz.act.service;

import kr.co.kfs.asseterp.biz.act.dto.AccountNumRes;
import kr.co.kfs.asseterp.biz.act.dto.AccountNumSaveReq;
import kr.co.kfs.asseterp.biz.act.mapper.ActAccountNumMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/act/Act09_AccountNum.java (selectByRetrieve L58 / update L72 / delete L81) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActAccountNumService {

    private final ActAccountNumMapper mapper;

    /** AS-IS Act09_Tab_AccountNum.retrieve() L121: 로그인 회사의 회기 목록(회기 순) */
    public List<AccountNumRes> search(UserPrincipal user) {
        return mapper.selectByRetrieve(user.getCompanyId());
    }

    /**
     * AS-IS update(UpdateDataModel): 로그인 회사에 이미 있는 ID면 UPDATE, 없으면(임시 음수 ID) 새 시퀀스로 INSERT
     * → 저장한 행을 요청 순서로 반환
     */
    @Transactional
    public List<AccountNumRes> save(UserPrincipal user, List<AccountNumSaveReq> rows) {
        Long companyId = user.getCompanyId();
        List<AccountNumRes> saved = new ArrayList<>();
        for (AccountNumSaveReq req : rows) {
            Long id = req.accountNumId();
            if (id != null && id > 0 && mapper.selectById(id, companyId) != null) {
                mapper.updateAccountNum(companyId, req);
            } else {
                id = mapper.selectNextId();
                mapper.insertAccountNum(id, companyId, req);
            }
            saved.add(mapper.selectById(id, companyId));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel): ID 목록 → 지운 건수 (로그인 회사의 행만) */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteAccountNums(ids, user.getCompanyId());
    }
}
