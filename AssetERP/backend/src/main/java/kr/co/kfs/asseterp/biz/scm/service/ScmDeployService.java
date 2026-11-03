package kr.co.kfs.asseterp.biz.scm.service;

import kr.co.kfs.asseterp.biz.scm.dto.DeployProgramRes;
import kr.co.kfs.asseterp.biz.scm.dto.DeployRes;
import kr.co.kfs.asseterp.biz.scm.mapper.ScmDeployMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** 배포처리 (AS-IS Scm13_Tab_Deploy → server/scm/Scm11_DevStep.selectByDeployPersonId L50 / Scm13_DevProgram.selectByDeployTgtDevId L32 · updateNote L105 · updateDeploy L116 · updateResultDeploy L132) (EE18) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScmDeployService {

    private final ScmDeployMapper mapper;

    public List<DeployRes> searchDeploys(LocalDate startDate, LocalDate closeDate, String searchText, String systemCode,
                                         boolean checkBox, Long personId) {
        String text = "%" + (searchText == null ? "" : searchText) + "%";
        return mapper.selectByDeployPersonId(startDate, closeDate, text, systemCode == null ? "%" : systemCode, checkBox, personId);
    }

    public List<DeployProgramRes> searchPrograms(Long devId) {
        return mapper.selectByDeployTgtDevId(devId);
    }

    /** 고른 프로그램을 모두 배포처리 (배포여부 'true' + 배포일시 = 지금) */
    @Transactional
    public void deploy(List<Long> devProgramIds) {
        for (Long id : devProgramIds) mapper.updateDeploy(id, "true");
    }

    @Transactional
    public void updateNote(Long devProgramId, String note) {
        mapper.updateNote(devProgramId, note);
    }

    /** 모든 배포 대상이 배포되면 배포 단계(90)의 확인일시·결과를 채운다 */
    @Transactional
    public void updateResultDeploy(Long devId) {
        mapper.updateResultDeploy(devId);
    }
}
