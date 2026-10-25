package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckInsuffRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckInsuffSaveReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckManlDetailRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckRecordParam;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmCheckOrgMapper;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmChckInsuffMapper;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmChckRecordMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 미흡/개선 내역(조치계획) — 조치계획 등록 (AS-IS Tdm54_Edit_ChckInsuff, N22) → server/tdm/Tdm54_ChckInsuff. N24가 조치 처리를 더한다 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmChckInsuffService {

    private final TdmChckInsuffMapper mapper;
    private final TdmCheckManlService checkManlService;
    private final TdmCheckOrgMapper orgMapper;
    private final TdmChckRecordMapper recordMapper;

    /** AS-IS tdm.Tdm54_ChckInsuff.selectByChckManlId — 점검항목의 조치계획 한 건, 없으면 null */
    public ChckInsuffRes searchByManl(UserPrincipal user, Long chckManlId) {
        checkManlService.requireManl(user, chckManlId);
        List<ChckInsuffRes> list = mapper.selectByChckManlId(chckManlId);
        return list.isEmpty() ? null : list.get(0);
    }

    /** AS-IS tdm.Tdm54_ChckInsuff.modelUpdate — chckInsuffId가 없으면 최초등록(상태 10 발생), 있으면 계획변경. 점검이력(tdm55)을 남긴다 */
    @Transactional
    public ChckInsuffRes save(UserPrincipal user, ChckInsuffSaveReq req) {
        CheckManlDetailRes manl = checkManlService.requireManl(user, req.chckManlId());
        Long chckInsuffId = req.chckInsuffId();
        String procType;
        if (chckInsuffId == null) {
            procType = "발생(최초등록)";
            chckInsuffId = mapper.selectNextId();
            mapper.insertInsuff(chckInsuffId, req, manl.companyId(), manl.roleId(), manl.orgId(), user.getUserId(), "10", manl.checkYm(), user.getName());
        } else {
            procType = "발생(계획변경)";
            boolean mine = false;
            for (ChckInsuffRes row : mapper.selectByChckManlId(manl.chckManlId())) {
                if (chckInsuffId.equals(row.chckInsuffId())) {
                    mine = true;
                }
            }
            if (!mine || mapper.updateInsuff(req, manl.companyId(), user.getName()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
        }

        // 점검이력 생성(tdm55)
        String stdDate = req.stdDate() != null ? req.stdDate() : orgMapper.selectCheckStartDate(manl.chckJobId());
        recordMapper.insertRecord(new CheckRecordParam(manl.companyId(), stdDate, chckInsuffId, "TDM54", procType, user.getUserId(), "미흡", req.actionPlan(), null));
        return searchByManl(user, manl.chckManlId());
    }
}
