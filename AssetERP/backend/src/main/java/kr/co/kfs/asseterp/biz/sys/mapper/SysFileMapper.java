package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.FileMonthRes;
import kr.co.kfs.asseterp.biz.sys.dto.FileRes;
import kr.co.kfs.asseterp.biz.sys.dto.FileTotalParam;
import kr.co.kfs.asseterp.biz.sys.dto.FileTotalRes;
import kr.co.kfs.asseterp.biz.sys.dto.FileYearRes;
import kr.co.kfs.asseterp.biz.sys.dto.TrashFileRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS sys10_file.xml — 파일 공통(B10) */
@Mapper
public interface SysFileMapper {
    FileRes selectById(@Param("fileId") Long fileId);

    List<FileRes> selectByParentId(@Param("parentId") Long parentId);

    /** F09: FileDownload apprList의 정렬(파일 구분이 먼저) */
    List<FileRes> selectByApprId(@Param("parentId") Long parentId);

    FileRes selectOneByParentId(@Param("parentId") Long parentId);

    int countPersonById(@Param("personId") Long personId);

    Long selectNextId();

    int insertFile(@Param("fileId") Long fileId, @Param("parentId") Long parentId, @Param("fileNm") String fileNm,
                   @Param("serverPath") String serverPath, @Param("size") Double size, @Param("fileExt") String fileExt,
                   @Param("fileYn") String fileYn);

    int deleteById(@Param("fileId") Long fileId);

    /** AS-IS selectByTotalSize (useYn = 'true'/'false', A16 고객별 서버사용량) */
    List<FileTotalRes> selectByTotalSize(@Param("useYn") String useYn);

    /** AS-IS selectByTotalSizeYear */
    List<FileYearRes> selectByTotalSizeYear(FileTotalParam param);

    /** AS-IS selectByTotalSizeMonth */
    List<FileMonthRes> selectByTotalSizeMonth(FileTotalParam param);

    /** AS-IS findTrashFile (A17 미사용 파일조회) */
    List<TrashFileRes> findTrashFile();
}
