package kr.co.kfs.asseterp.biz.crd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.crd.dto.CrdExcelCodeRes;
import kr.co.kfs.asseterp.biz.crd.dto.CrdExcelCodeSaveReq;
import kr.co.kfs.asseterp.biz.crd.mapper.CrdExcelCodeMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS server/crd/Crd11_ExcelCode.java (selectByCompanyId L26 / update L55 / delete L60).
 * 로그인 회사의 행만 다룬다(Crd10과 같음)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CrdExcelCodeService {

    private final CrdExcelCodeMapper mapper;

    /** defaults이면 회사 0의 기본 맵핑(Crd11_Lookup_ExcelCode.excelCodeChk가 회사 맵핑이 없을 때 retrieve(0L)로 읽는다) */
    public List<CrdExcelCodeRes> search(UserPrincipal user, String bankCode, boolean defaults) {
        return mapper.selectByCompanyId(defaults ? 0L : user.getCompanyId(), bankCode);
    }

    /** AS-IS crd.Crd11_ExcelCode.copyData L35-53 ([커스텀 설정]) — 화면에 보이는 기본 맵핑을 로그인 회사의 맵핑으로 복사한다 → 복사한 건수 */
    @Transactional
    public int copy(UserPrincipal user, String bankCode, List<CrdExcelCodeSaveReq> rows) {
        for (CrdExcelCodeSaveReq r : rows) {
            mapper.insert(mapper.selectNextId(), user.getCompanyId(), new CrdExcelCodeSaveReq(null, bankCode, r.bankExcelCode(), r.seq(), r.text()));
        }
        return rows.size();
    }

    /**
     * AS-IS update(UpdateDataModel) → 저장된 행(요청 순서).
     * 구분코드·위치 필수, 중복 코드 검사는 화면이 하고 서버는 DB 오류(NOT NULL)를 막으려고 필수만 같은 문구로 막는다
     */
    @Transactional
    public List<CrdExcelCodeRes> save(UserPrincipal user, List<CrdExcelCodeSaveReq> rows) {
        for (CrdExcelCodeSaveReq req : rows) {
            if (req.bankCode() == null || req.bankCode().isEmpty() || req.bankExcelCode() == null || req.bankExcelCode().isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "구분코드는 필수선택항목입니다.");
            }
            if (req.seq() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "위치(세로줄)은 필수입력사항입니다.");
            }
        }
        return rows.stream().map(req -> {
            boolean exists = req.excelCodeId() != null && req.excelCodeId() > 0 && mapper.selectById(req.excelCodeId()) != null;
            if (exists) {
                if (mapper.update(user.getCompanyId(), req) == 0) {
                    throw new BusinessException(ErrorCode.ACCESS_DENIED);
                }
                return mapper.selectById(req.excelCodeId());
            }
            long newId = mapper.selectNextId();
            mapper.insert(newId, user.getCompanyId(), req);
            return mapper.selectById(newId);
        }).toList();
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteByIds(user.getCompanyId(), ids);
    }
}
