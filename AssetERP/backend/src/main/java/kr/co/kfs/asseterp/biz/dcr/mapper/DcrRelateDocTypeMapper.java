package kr.co.kfs.asseterp.biz.dcr.mapper;

import kr.co.kfs.asseterp.biz.dcr.dto.DcrRelateDocTypeRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrRelateDocTypeSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/dcr/mapper/dcr06_relate_doc_Type.xml + UpdateDataModel(dcr06_relate_doc_Type) */
@Mapper
public interface DcrRelateDocTypeMapper {
    /** AS-IS selectByClassTreeId (양식 제목순) */
    List<DcrRelateDocTypeRes> selectByClassTreeId(@Param("classTreeId") Long classTreeId);

    DcrRelateDocTypeRes selectById(@Param("relateDocTypeId") Long relateDocTypeId);

    Long selectNextId();

    int insert(@Param("relateDocTypeId") Long relateDocTypeId, @Param("companyId") Long companyId, @Param("req") DcrRelateDocTypeSaveReq req);

    int update(@Param("companyId") Long companyId, @Param("req") DcrRelateDocTypeSaveReq req);

    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);
}
