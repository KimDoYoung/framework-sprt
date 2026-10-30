package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.FileMonthRes;
import kr.co.kfs.asseterp.biz.sys.dto.FileLockRes;
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

    /** sys10_file.selectByParentId2 — 잠김(lockYn)이 붙은 목록 */
    List<FileLockRes> selectByParentId2(@Param("parentId") Long parentId);

    List<FileRes> selectByParentId(@Param("parentId") Long parentId);

    /** J07: 사원의 가족금융거래정보 이용동의서 첨부파일 (AS-IS sys10_file.selectByFamilyConsentId). 수정: 로그인 회사의 사원만 */
    List<FileRes> selectByFamilyConsentId(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** F09: FileDownload apprList의 정렬(파일 구분이 먼저) */
    List<FileRes> selectByApprId(@Param("parentId") Long parentId);

    FileRes selectOneByParentId(@Param("parentId") Long parentId);

    int countPersonById(@Param("personId") Long personId);

    Long selectNextId();

    int insertFile(@Param("fileId") Long fileId, @Param("parentId") Long parentId, @Param("fileNm") String fileNm,
                   @Param("serverPath") String serverPath, @Param("size") Double size, @Param("fileExt") String fileExt,
                   @Param("fileYn") String fileYn);

    int deleteById(@Param("fileId") Long fileId);

    /** AS-IS Sys10_File.insertFileModel (RD가 만든 파일: printYn·extYn·adminYn 모두 true) → sys10_file.insertUpdate */
    int insertRdFile(@Param("fileId") Long fileId, @Param("parentId") Long parentId, @Param("fileNm") String fileNm,
                     @Param("serverPath") String serverPath, @Param("size") Double size, @Param("fileExt") String fileExt);

    /** AS-IS selectByTotalSize (useYn = 'true'/'false', A16 고객별 서버사용량) */
    List<FileTotalRes> selectByTotalSize(@Param("useYn") String useYn);

    /** AS-IS selectByTotalSizeYear */
    List<FileYearRes> selectByTotalSizeYear(FileTotalParam param);

    /** AS-IS selectByTotalSizeMonth */
    List<FileMonthRes> selectByTotalSizeMonth(FileTotalParam param);

    /** AS-IS findTrashFile (A17 미사용 파일조회) */
    List<TrashFileRes> findTrashFile();
}
