package kr.co.kfs.asseterp.biz.batch.action;

import kr.co.kfs.asseterp.biz.batch.dto.BatchFileRow;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchFileMapper;
import kr.co.kfs.asseterp.biz.batch.service.BatchAction;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.util.List;

/**
 * AS-IS BatchMain.filemissing (L3830) — `year`(yyyy)에 등록된 파일 중 서버에 실제로 없는 것을 찾아 로그로 남긴다.
 * DB는 읽기만 한다. 결과 문구에는 건수가 없고(AS-IS와 같다) 총 파일 수·없는 파일은 서버 로그에 남는다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FileMissingAction implements BatchAction {

    private final BatchFileMapper fileMapper;

    @Override
    public String actionCode() {
        return "filemissing";
    }

    @Override
    @Transactional(readOnly = true)
    public String run(BatchReq req) {
        String year = req.year();
        List<BatchFileRow> fileList = fileMapper.selectByYear(year);

        int total = fileList.size();
        int missingCount = 0;
        log.info("{}년도 총 파일 수: {}", year, total);

        for (BatchFileRow file : fileList) {
            String fullPath = file.serverPath() + File.separator + file.fileId();
            if (!new File(fullPath).exists()) {
                missingCount++;
                log.warn("[없음] ID: {}, 경로: {}, size: {}", file.fileId(), fullPath, file.size());
            }
        }
        log.info("존재하지 않는 파일 수: {}", missingCount);
        return "filemissing 작업완료";
    }
}
