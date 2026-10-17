package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.FilePolicyRes;
import kr.co.kfs.asseterp.biz.sys.dto.FilePolicySaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SysFilePolicyMapper {

    /** AS-IS sys60_file_policy.selectByText */
    List<FilePolicyRes> selectByText(@Param("searchText") String searchText);

    /** AS-IS sys60_file_policy.selectById (저장 뒤 다시 읽기) */
    FilePolicyRes selectById(@Param("filePolicyId") Long filePolicyId);

    /** AS-IS dbConfig.getSeq (= f_create_seq) */
    Long selectNextId();

    int insertFilePolicy(@Param("id") Long id, @Param("r") FilePolicySaveReq req);

    int updateFilePolicy(@Param("r") FilePolicySaveReq req);

    /** AS-IS UpdateDataModel.deleteModel */
    int deleteFilePolicies(@Param("ids") List<Long> ids);
}
