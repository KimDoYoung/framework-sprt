package kr.co.kfs.asseterp.biz.est.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.est.dto.PfFeeTypeRes;
import kr.co.kfs.asseterp.biz.est.dto.PfFeeTypeSaveReq;
import kr.co.kfs.asseterp.biz.est.mapper.EstPfFeeTypeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/est/Est01_PfFeeType.java (selectByCompanyId L24 / update L42 / delete L47) + Est02_PfContract.checkList L39 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EstPfFeeTypeService {

    private final EstPfFeeTypeMapper mapper;

    /** AS-IS selectByCompanyId */
    public List<PfFeeTypeRes> search(UserPrincipal user) {
        return mapper.selectByCompanyId(user.getCompanyId());
    }

    /** AS-IS update(UpdateDataModel): ID가 DB에 있으면 UPDATE, 없으면 INSERT(0 이하는 새 id) → 저장된 행(요청 순서) */
    @Transactional
    public List<PfFeeTypeRes> save(UserPrincipal user, List<PfFeeTypeSaveReq> rows) {
        return rows.stream().map(req -> saveOne(user.getCompanyId(), req)).toList();
    }

    private PfFeeTypeRes saveOne(Long companyId, PfFeeTypeSaveReq req) {
        boolean exists = req.pfFeeTypeId() != null && req.pfFeeTypeId() > 0 && mapper.selectById(req.pfFeeTypeId(), companyId) != null;
        if (exists) {
            mapper.updatePfFeeType(companyId, req);
            return mapper.selectById(req.pfFeeTypeId(), companyId);
        }
        long newId = req.pfFeeTypeId() != null && req.pfFeeTypeId() > 0 ? req.pfFeeTypeId() : mapper.selectNextId();
        mapper.insertPfFeeType(newId, companyId, req);
        return mapper.selectById(newId, companyId);
    }

    /** AS-IS deleteModel: 체크한 행을 지운다(로그인 회사 행만) */
    @Transactional
    public void delete(UserPrincipal user, List<Long> pfFeeTypeIds) {
        if (pfFeeTypeIds == null || pfFeeTypeIds.isEmpty()) {
            return;
        }
        mapper.deletePfFeeTypes(user.getCompanyId(), pfFeeTypeIds);
    }

    /** AS-IS Est02_PfContract.checkList: 이 수수료 항목을 쓰는 용역계약 건수 (0이면 사용 중이 아님) */
    public int countInUse(List<Long> pfFeeTypeIds) {
        if (pfFeeTypeIds == null || pfFeeTypeIds.isEmpty()) {
            return 0;
        }
        return mapper.selectContractIdsByFeeTypes(pfFeeTypeIds).size();
    }
}
