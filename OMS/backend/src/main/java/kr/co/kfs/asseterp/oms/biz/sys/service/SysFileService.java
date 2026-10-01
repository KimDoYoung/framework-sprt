package kr.co.kfs.asseterp.oms.biz.sys.service;

import kr.co.kfs.asseterp.oms.biz.sys.dto.FileUsageParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.FileUsagePeriodRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.FileUsageRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.TrashFileRes;
import kr.co.kfs.asseterp.oms.biz.sys.mapper.SysFileMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 파일 저장소 조회 (AS-IS server/sys/Sys10_File 중 사용량·미사용 파일). 파일 보기·받기·삭제는 공통 파일 정책 결정 후 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysFileService {

    private final SysFileMapper sysFileMapper;

    /** AS-IS selectByTotalSize: useYn=true면 사용 고객만 */
    public List<FileUsageRes> searchUsage(boolean useYn) {
        return sysFileMapper.searchUsage(new FileUsageParam(String.valueOf(useYn), null, null));
    }

    /** AS-IS selectByTotalSizeYear */
    public List<FileUsagePeriodRes> searchUsageByYear(String locNm) {
        return sysFileMapper.searchUsageByYear(new FileUsageParam(null, locNm, null));
    }

    /** AS-IS selectByTotalSizeMonth */
    public List<FileUsagePeriodRes> searchUsageByMonth(String locNm, String year) {
        return sysFileMapper.searchUsageByMonth(new FileUsageParam(null, locNm, year));
    }

    /** AS-IS findTrashFile: 어떤 업무 테이블에서도 참조하지 않는 sys10 파일 */
    public List<TrashFileRes> searchTrashFiles() {
        return sysFileMapper.searchTrashFiles();
    }
}
