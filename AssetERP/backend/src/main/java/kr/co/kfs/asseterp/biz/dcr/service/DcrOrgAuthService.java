package kr.co.kfs.asseterp.biz.dcr.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrClassTreeRef;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrOrgAuthByClassRow;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrOrgAuthByClassSaveReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrOrgAuthByOrgRow;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrOrgAuthByOrgSaveReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrOrgAuthClassRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrOrgAuthCopyReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrOrgAuthOrgRes;
import kr.co.kfs.asseterp.biz.dcr.mapper.DcrOrgAuthMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * 문서권한관리 (EE06 Dcr03_Tab_DcrAuth, EE07 Dcr03_Tab_OrgAuth) —
 * AS-IS org.Org01_Code.selectByDcrCodeId·updateDcrAuth·copyDcrRight, dcr.Dcr03_OrgAuth.selectByOrgCodeId·update
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DcrOrgAuthService {

    private final DcrOrgAuthMapper mapper;

    /** AS-IS sys.Sys01_Company.selectById 중 dcrDetailUseYn — 화면 아래 안내 문구가 갈린다 */
    public boolean getDetailUse(UserPrincipal user) {
        return "true".equals(mapper.selectDcrDetailUseYn(user.getCompanyId()));
    }

    /** AS-IS org.Org01_Code.selectByDcrCodeId L264. 상위조직 0부터 단계마다 하위를 찾아 전위 순서 + depth로 편다 */
    public List<DcrOrgAuthOrgRes> searchOrgsByClassTree(UserPrincipal user, Long classTreeId) {
        List<DcrOrgAuthOrgRes> out = new ArrayList<>();
        appendOrgs(out, user.getCompanyId(), classTreeId, 0L, 0);
        return out;
    }

    private void appendOrgs(List<DcrOrgAuthOrgRes> out, Long companyId, Long classTreeId, Long parentCodeId, int depth) {
        for (DcrOrgAuthOrgRes node : mapper.selectOrgsByClassTree(companyId, parentCodeId, classTreeId)) {
            out.add(node.withDepth(depth));
            appendOrgs(out, companyId, classTreeId, node.codeId(), depth + 1);
        }
    }

    /**
     * AS-IS org.Org01_Code.updateDcrAuth L443. 바뀐 조직마다 고른 문서분류와 그 하위 모두에 대해
     * 같은 (조직, 문서분류) 중복 행은 하나만 남기고, 조회여부를 넣고, 작성여부는 문서세부분류를 쓰지 않는 회사에서 Link가 걸린 분류면 false로 한다.
     * 문서분류·조직은 로그인 회사 것만(보안 보강) → 저장한 조직 행 수
     */
    @Transactional
    public int updateByClassTree(UserPrincipal user, DcrOrgAuthByClassSaveReq req) {
        Long companyId = user.getCompanyId();
        requireClassTree(companyId, req.classTreeId());
        List<DcrOrgAuthByClassRow> rows = req.rows() == null ? List.of() : req.rows();
        if (rows.isEmpty()) {
            return 0;
        }
        List<DcrClassTreeRef> downs = mapper.selectDownClassTrees(req.classTreeId());
        boolean detailUse = getDetailUse(user);
        for (DcrOrgAuthByClassRow row : rows) {
            requireOrg(companyId, row.orgCodeId());
            String retrieveYn = yn(row.retrieveYn());
            for (DcrClassTreeRef down : downs) {
                mapper.deleteDuplicates(row.orgCodeId(), down.classTreeId());
                mapper.upsertAuth(row.orgCodeId(), down.classTreeId(), retrieveYn,
                        updateYn(detailUse, down.companyId(), down.classTreeId(), row.updateYn()));
            }
        }
        return rows.size();
    }

    /** AS-IS dcr.Dcr03_OrgAuth.selectByOrgCodeId L27 (dcr01_class_tree.selectByOrgCodeId_1Bang) */
    public List<DcrOrgAuthClassRes> searchClassTreesByOrg(UserPrincipal user, Long orgCodeId) {
        return mapper.selectClassTreesByOrg(user.getCompanyId(), orgCodeId);
    }

    /**
     * AS-IS dcr.Dcr03_OrgAuth.update L99. 바뀐 문서분류마다 조회·작성 여부를 넣는다(없으면 false).
     * 문서세부분류를 쓰지 않는 회사에서 Link가 걸린 분류는 작성여부를 false로 한다. 문서분류·조직은 로그인 회사 것만(보안 보강) → 저장한 행 수
     */
    @Transactional
    public int updateByOrg(UserPrincipal user, DcrOrgAuthByOrgSaveReq req) {
        Long companyId = user.getCompanyId();
        requireOrg(companyId, req.orgCodeId());
        List<DcrOrgAuthByOrgRow> rows = req.rows() == null ? List.of() : req.rows();
        boolean detailUse = getDetailUse(user);
        for (DcrOrgAuthByOrgRow row : rows) {
            requireClassTree(companyId, row.classTreeId());
            mapper.upsertAuth(req.orgCodeId(), row.classTreeId(), yn(row.retrieveYn()),
                    updateYn(detailUse, companyId, row.classTreeId(), row.updateYn()));
        }
        return rows.size();
    }

    /**
     * AS-IS org.Org01_Code.copyDcrRight L523. 출발 조직의 문서권한(조회·작성)을 도착 조직마다 문서분류별로 그대로 덮어쓴다.
     * AS-IS는 도착 조직마다 서비스를 따로 불렀으나 한 요청·한 트랜잭션으로 모은다 → 복사한 도착 조직 수
     */
    @Transactional
    public int copy(UserPrincipal user, DcrOrgAuthCopyReq req) {
        Long companyId = user.getCompanyId();
        requireOrg(companyId, req.startOrgCodeId());
        List<Long> closes = req.closeOrgCodeIds() == null ? List.of() : req.closeOrgCodeIds();
        List<DcrOrgAuthClassRes> starts = mapper.selectClassTreesByOrg(companyId, req.startOrgCodeId());
        for (Long close : closes) {
            requireOrg(companyId, close);
            for (DcrOrgAuthClassRes start : starts) {
                mapper.upsertAuth(close, start.classTreeId(), yn(start.retrieveYn()), yn(start.updateYn()));
            }
        }
        return closes.size();
    }

    /** 작성여부: 문서세부분류를 쓰는 회사는 그대로, 아니면 Link가 걸린 문서분류는 false (AS-IS "링크된 문서분류인경우 작성권한 없음") */
    private String updateYn(boolean detailUse, Long companyId, Long classTreeId, String value) {
        if (!detailUse && mapper.countLinksByClassTree(companyId, classTreeId) > 0) {
            return "false";
        }
        return yn(value);
    }

    private static String yn(String v) {
        return "true".equals(v) ? "true" : "false";
    }

    private void requireClassTree(Long companyId, Long classTreeId) {
        if (classTreeId == null || mapper.countClassTree(companyId, classTreeId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "문서분류를 찾을 수 없습니다.");
        }
    }

    private void requireOrg(Long companyId, Long orgCodeId) {
        if (orgCodeId == null || mapper.countOrg(companyId, orgCodeId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "조직을 찾을 수 없습니다.");
        }
    }
}
