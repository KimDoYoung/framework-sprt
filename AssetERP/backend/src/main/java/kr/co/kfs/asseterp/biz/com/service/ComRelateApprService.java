package kr.co.kfs.asseterp.biz.com.service;

import kr.co.kfs.asseterp.biz.apr.mapper.AprApprNewMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.com.dto.ComRelateApprRes;
import kr.co.kfs.asseterp.biz.com.dto.ComRelateApprSaveReq;
import kr.co.kfs.asseterp.biz.com.mapper.ComRelateApprMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 증빙자료(상신문서 연결) — AS-IS server/com/Com01_RelateAppr (selectByKeyTableId·modelUpdate·listUpdate·delete) + apr.Apr01_Appr.permissionsCheck (EE34) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ComRelateApprService {

    private final ComRelateApprMapper mapper;
    private final AprApprNewMapper aprNewMapper;

    /** com.Com01_RelateAppr.selectByKeyTableId (L24-29) */
    public List<ComRelateApprRes> search(UserPrincipal user, Long keyTableId) {
        return mapper.selectByKeyTableId(user.getCompanyId(), keyTableId);
    }

    /** modelUpdate(문서 1개)·listUpdate(여러 개) — 번호는 서버가 새로 받아 문서마다 한 행을 넣는다. → 넣은 행 수 */
    @Transactional
    public int add(UserPrincipal user, ComRelateApprSaveReq req) {
        if (req == null || req.keyTable() == null || req.keyTable().isBlank() || req.keyTable().length() > 5 || req.keyTableId() == null
                || req.apprIds() == null || req.apprIds().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "연결할 문서 정보가 없습니다.");
        }
        int n = 0;
        for (Long apprId : req.apprIds()) {
            n += mapper.insertRelateAppr(mapper.selectNextId(), req.keyTable(), req.keyTableId(), apprId, user.getCompanyId());
        }
        return n;
    }

    /** delete (L78-81) → 지운 행 수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> relateApprIds) {
        int n = 0;
        for (Long id : relateApprIds == null ? List.<Long>of() : relateApprIds) {
            n += mapper.deleteRelateAppr(id, user.getCompanyId());
        }
        return n;
    }

    /** [신규문서 작성] 단추를 둘 회사인가 — erpProductCode 가 S1이 아닌 회사 (Com01_Lookup_RelateAppr 생성자 L78) */
    public boolean apprButtonEnabled(UserPrincipal user) {
        return mapper.selectApprButtonEnabled(user.getCompanyId());
    }

    /** apr.Apr01_Appr.permissionsCheck — 상세보기 전에 열람권한이 있는지 (ApprCallbackResult) */
    public boolean canView(UserPrincipal user, Long apprId) {
        Long orgId = aprNewMapper.selectOrgCodeId(user.getUserId());
        return mapper.countPermission(apprId, user.getUserId(), orgId, user.getCompanyId()) > 0;
    }

    /** apr.Apr01_Appr.permissionsCheckWithDel — 폐기문서(apr99)까지 포함한 열람권한 (ApprCallbackResult(apprId, personId), #1098 상세보기) */
    public boolean canViewWithDel(UserPrincipal user, Long apprId) {
        Long orgId = aprNewMapper.selectOrgCodeId(user.getUserId());
        return mapper.countPermissionWithDel(apprId, user.getUserId(), orgId, user.getCompanyId()) > 0;
    }
}
