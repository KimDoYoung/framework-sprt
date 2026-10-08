package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.TransDeleteParam;
import kr.co.kfs.asseterp.biz.emp.dto.TransPersonRes;
import kr.co.kfs.asseterp.biz.emp.dto.TransRes;
import kr.co.kfs.asseterp.biz.emp.dto.TransRow;
import kr.co.kfs.asseterp.biz.emp.dto.TransSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpTransMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/** AS-IS server/emp/Emp03_Trans.java (selectByPersonId / update / delete / deleteCheck) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpTransService {

    private final EmpTransMapper empTransMapper;

    /** AS-IS selectByPersonId: 발령일 내림차순 */
    public List<TransRes> searchTranses(UserPrincipal user, Long personId) {
        return empTransMapper.searchTranses(user.getCompanyId(), personId);
    }

    /** AS-IS selectByText (사원찾기): '%검색어%', 기준일 = 지금(AS-IS new Date()) */
    public List<TransPersonRes> searchTransPersons(UserPrincipal user, String searchText) {
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        return empTransMapper.searchTransPersons(user.getCompanyId(), like, LocalDateTime.now());
    }

    /**
     * AS-IS update(UpdateDataModel): 행마다 신규면 INSERT, 아니면 UPDATE 하고 selectById로 다시 읽어 요청 순서대로 돌려준다.
     * 사람은 로그인 회사 사람이어야 한다. 같은 사람·발령일·발령구분은 DB 유일 인덱스 → 미리 세어 화면 문구로 알린다(05 §6 DB 오류).
     */
    @Transactional
    public List<TransRes> updateTranses(UserPrincipal user, List<TransSaveReq> rows) {
        Long companyId = user.getCompanyId();
        List<TransRes> saved = new ArrayList<>();
        for (TransSaveReq req : rows) {
            if (req.transDate() == null || req.orgCodeId() == null || req.posCd() == null || req.transCd() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "발령일·발령구분·발령조직·발령직위는 필수입니다.");
            }
            if (empTransMapper.countPerson(companyId, req.personId()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            boolean isNew = req.transId() == null || req.transId() <= 0;
            Long transId = isNew ? empTransMapper.selectNextId() : req.transId();
            TransRow row = new TransRow(transId, companyId, req.personId(), req.transDate(), req.transCd(), req.kindCd(),
                    req.orgCodeId(), req.titleCd(), req.posCd(), req.duty(), req.expiryDate(), req.transReason());
            if (empTransMapper.countSameTrans(row) > 0) {
                throw new BusinessException(ErrorCode.DUPLICATE_DATA, "동일안 발령일에 이미 발령내용이 존재합니다");
            }
            if (isNew) {
                empTransMapper.insertTrans(row);
            } else if (empTransMapper.updateTrans(row) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(empTransMapper.selectTrans(transId));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel) → 지운 건수 */
    @Transactional
    public int deleteTranses(UserPrincipal user, List<Long> transIds) {
        if (transIds == null || transIds.isEmpty()) {
            return 0;
        }
        return empTransMapper.deleteTranses(new TransDeleteParam(user.getCompanyId(), transIds));
    }
}
