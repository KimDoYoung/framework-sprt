package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.sys.dto.FileRes;
import kr.co.kfs.asseterp.biz.sys.mapper.SysFileMapper;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckExctPdfTarget;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmManlPdfMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.util.List;

/**
 * 이행점검보고서 PDF 생성 중 RD 서버가 보기 전에 <b>먼저 확정(커밋)돼야 하는</b> 단계 ({@link ManlOrgPdfSteps}와 같은 이유).
 * AS-IS는 서비스 호출마다 따로 커밋했다(Tdm53_ChckExct.fileCheck, Sys99_Print.CreateTdmCheckJob).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CheckExctPdfSteps {

    /** AS-IS Sys99_Print.CreateTdmCheckJob L218 — 같은 사용자의 이전 이행점검 자료를 지울 때 쓰는 패턴 */
    private static final String CLEAR_JOB_TYPE = "%CHCK_%";
    /** AS-IS createRd — 책무 이행점검 */
    public static final String JOB_TYPE = "MK_CHCK";

    private final TdmManlPdfMapper pdfMapper;
    private final SysFileMapper sysFileMapper;

    /** AS-IS Tdm53_ChckExct.fileCheck: 이전 첨부의 첫 파일만 실제로 지우고 sys10_file 행은 모두 지운다 */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void clearOldFiles(Long chckExctId) {
        List<FileRes> files = sysFileMapper.selectByParentId(chckExctId);
        if (!files.isEmpty()) {
            FileRes first = files.get(0);
            File file = new File(first.serverPath(), first.fileId().toString());
            log.info("이전 이행점검보고서 파일 삭제 fileId={} 결과={}", first.fileId(), file.delete());
        }
        for (FileRes f : files) {
            sysFileMapper.deleteById(f.fileId());
        }
    }

    /** AS-IS Sys99_Print.CreateTdmCheckJob: 데이터 정리 → 데이터 생성. 돌려주는 값은 groupId */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Long createPrintData(CheckExctPdfTarget target) {
        Long groupId = pdfMapper.selectNextId();
        pdfMapper.deletePrintByJobTp(target.companyId(), target.exctId(), CLEAR_JOB_TYPE);
        // AS-IS는 DB 함수의 반환값을 보지 않는다. 자료를 못 만들면 'N' 등이 오므로 로그로만 남긴다
        log.info("tdm_create_data(MK_CHCK) chckExctId={} groupId={} → {}",
                target.chckExctId(), groupId,
                pdfMapper.createTdmData(JOB_TYPE, target.updDate(), target.chckExctId(), target.companyId(), target.exctId(), groupId));
        return groupId;
    }
}
