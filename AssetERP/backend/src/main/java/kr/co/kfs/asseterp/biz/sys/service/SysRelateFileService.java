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

    @Transactional
    public int checkFileDelete(Long fileId, Long parentId) {
        if (sysRelateFileMapper.countCheckFileDelete01(fileId, parentId) > 0) {
            sysRelateFileMapper.deleteRelateFile(fileId, parentId);
            return STATUS_RELATE_DELETED;
        }
        return sysRelateFileMapper.countCheckFileDelete02(fileId, parentId) > 0 ? STATUS_IN_USE : STATUS_DELETABLE;
    }
}
