package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.ast.dto.TrCodeWindowAddReq;
import kr.co.kfs.asseterp.biz.ast.dto.TrCodeWindowRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrCodeWindowSaveReq;
import kr.co.kfs.asseterp.biz.ast.mapper.AstTrCodeWindowMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS server/ast/Ast15_TrCodeWindow.java (selectByAll L24, selectByClassName L29, getTrCode L48, insert L66, modelUpdate L87, delete L105).
 * 운용사(회사)는 관리자 회사만 고를 수 있고 그 밖에는 로그인 회사 — 원본 Ast15_Lookup_TrCodeWindow 생성자 L72-78
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstTrCodeWindowService {

    private final AstTrCodeWindowMapper mapper;

    /** AS-IS selectByAll */
    public List<TrCodeWindowRes> searchAll(UserPrincipal user, Long companyId) {
        return mapper.selectByAll(user.companyOf(companyId));
    }

    /** AS-IS selectByClassName: 그 화면에 지정된 거래코드 */
    public List<TrCodeWindowRes> searchAssigned(UserPrincipal user, Long companyId, String className) {
        return mapper.selectByClassName(user.companyOf(companyId), className);
    }

    /** AS-IS getTrCode: 그 화면에 아직 지정되지 않은 거래코드 */
    public List<TrCodeWindowRes> searchUnassigned(UserPrincipal user, Long companyId, String className) {
        return mapper.getTrCode(user.companyOf(companyId), className);
    }

    /** AS-IS modelUpdate L87-98: 화면(거래코드 없음) 한 행을 새 ID로 넣고 다시 읽어 돌려준다 */
    @Transactional
    public TrCodeWindowRes add(UserPrincipal user, TrCodeWindowAddReq req) {
        if (req.windowClassName() == null || req.windowClassName().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "매뉴를 선택해주세요");
        }
        Long id = mapper.selectNextId();
        mapper.insert(id, user.companyOf(req.companyId()), req.windowClassName(), null, null);
        return mapper.selectById(id);
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수. 회사 조건을 더했다 */
    @Transactional
    public int delete(UserPrincipal user, Long companyId, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteByIds(user.companyOf(companyId), ids);
    }

    /** AS-IS insert L66-85: 그 화면의 거래코드 지정을 모두 지우고 왼쪽 그리드의 행을 새 ID로 다시 넣는다 → 넣은 건수 */
    @Transactional
    public int save(UserPrincipal user, TrCodeWindowSaveReq req) {
        Long companyId = user.companyOf(req.companyId());
        mapper.deleteClassName(companyId, req.className());
        int n = 0;
        for (TrCodeWindowSaveReq.Item item : req.items() == null ? List.<TrCodeWindowSaveReq.Item>of() : req.items()) {
            mapper.insert(mapper.selectNextId(), companyId, req.className(), item.trCode(), item.note());
            n++;
        }
        return n;
    }
}
