package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.sys.mapper.SysRelateFileMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** AS-IS server/sys/Sys11_RelateFile.checkFileDelete L57-76 — 첨부 삭제 판정 (B10) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysRelateFileService {

    /** 연관파일 연결만 지움 */
    public static final int STATUS_RELATE_DELETED = 1;
    /** 다른 상신문서에서 사용 중 — 화면이 "해당 파일은 다른 상신문서에서 사용 중이므로 삭제할 수 없습니다" */
    public static final int STATUS_IN_USE = 2;
    /** 실제 파일을 지워도 됨 — 화면이 이어서 파일 삭제(FileDelete)를 부른다 */
    public static final int STATUS_DELETABLE = 3;

    private final SysRelateFileMapper sysRelateFileMapper;

    /** 판정과 (상태 2일 때) 화면에 보일 문구 */
    public record DeleteCheck(int status, String message) {
    }

    /**
     * AS-IS Sys11_RelateFile.checkFileDelete L59-141. 02(진행 중 상신문서)와 03(그 밖에서 사용 중)이 모두 상태 2이고 문구만 다르다.
     * 03(N28 추가): 책무 양식처럼 점검항목·법규 분류에 연결된 파일이 연결을 남긴 채 지워지지 않게 한다
     */
    @Transactional
    public DeleteCheck checkFileDelete(Long fileId, Long parentId) {
        if (sysRelateFileMapper.countCheckFileDelete01(fileId, parentId) > 0) {
            sysRelateFileMapper.deleteRelateFile(fileId, parentId);
            return new DeleteCheck(STATUS_RELATE_DELETED, null);
        }
        if (sysRelateFileMapper.countCheckFileDelete02(fileId, parentId) > 0) {
            return new DeleteCheck(STATUS_IN_USE, "해당 파일은 다른 상신문서에서 사용 중이므로 삭제할 수 없습니다");
        }
        if (sysRelateFileMapper.countCheckFileDelete03(fileId, parentId) > 0) {
            return new DeleteCheck(STATUS_IN_USE, "해당 파일은 사용중인 파일이므로 삭제할 수 없습니다");
        }
        return new DeleteCheck(STATUS_DELETABLE, null);
    }
}
