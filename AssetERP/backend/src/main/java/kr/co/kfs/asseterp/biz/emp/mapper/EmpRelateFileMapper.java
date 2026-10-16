package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.RelateFileRes;
import kr.co.kfs.asseterp.biz.emp.dto.RelateFileSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/emp/Emp18_RelateFile.java */
@Mapper
public interface EmpRelateFileMapper {

    /** AS-IS emp18_relate_file.selectByPersonId */
    List<RelateFileRes> selectRelateFiles(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS emp18_relate_file.selectById */
    List<RelateFileRes> selectRelateFileById(@Param("relateFileId") Long relateFileId, @Param("companyId") Long companyId);

    /** AS-IS dbConfig.getSeq */
    Long selectNextId();

    /** AS-IS UpdateDataModel(emp18_relate_file) INSERT — 사원이 로그인 회사 사람일 때만 */
    int insertRelateFile(@Param("relateFileId") Long relateFileId, @Param("companyId") Long companyId, @Param("req") RelateFileSaveReq req);

    /** AS-IS UpdateDataModel(emp18_relate_file) UPDATE */
    int updateRelateFile(@Param("relateFileId") Long relateFileId, @Param("companyId") Long companyId, @Param("req") RelateFileSaveReq req);

    /** AS-IS UpdateDataModel(emp18_relate_file).deleteModel */
    int deleteRelateFiles(@Param("relateFileIds") List<Long> relateFileIds, @Param("companyId") Long companyId);
}
