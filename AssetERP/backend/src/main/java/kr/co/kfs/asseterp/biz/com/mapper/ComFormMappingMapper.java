package kr.co.kfs.asseterp.biz.com.mapper;

import kr.co.kfs.asseterp.biz.com.dto.FormMappingRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/** AS-IS server/com/mapper/com10_form_mapping.xml + dcr30_link.updateFormMappingId + UpdateDataModel(com10_form_mapping) */
@Mapper
public interface ComFormMappingMapper {
    FormMappingRes selectById(@Param("formMappingId") Long formMappingId);

    Long selectCompanyIdById(@Param("formMappingId") Long formMappingId);

    Long selectNextId();

    int insertFormMapping(@Param("formMappingId") Long formMappingId, @Param("companyId") Long companyId, @Param("content") String content);

    int updateContent(@Param("formMappingId") Long formMappingId, @Param("content") String content);

    Long selectLinkCompanyId(@Param("linkId") Long linkId);

    int updateFormMappingId(@Param("linkId") Long linkId, @Param("formMappingId") Long formMappingId);
}
