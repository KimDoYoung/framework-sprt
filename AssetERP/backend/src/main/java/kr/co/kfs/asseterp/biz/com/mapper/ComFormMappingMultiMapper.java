package kr.co.kfs.asseterp.biz.com.mapper;

import kr.co.kfs.asseterp.biz.com.dto.FormMappingMultiRes;
import kr.co.kfs.asseterp.biz.com.dto.FormMappingMultiSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/** AS-IS server/com/mapper/com11_form_mapping_multi.xml (selectByDetailCode) + UpdateDataModel(com11_form_mapping_multi) */
@Mapper
public interface ComFormMappingMultiMapper {
    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS com11_form_mapping_multi.selectByDetailCode */
    FormMappingMultiRes selectByDetailCode(@Param("companyId") Long companyId, @Param("kindCode") String kindCode,
                                           @Param("detailCode") String detailCode, @Param("linkCode") String linkCode);

    /** 번호로 회사 ID만 — 없으면 null */
    Long selectCompanyIdById(@Param("formMappingMultiId") Long formMappingMultiId);

    /** AS-IS UpdateDataModel 동적 INSERT */
    int insertFormMappingMulti(@Param("id") Long formMappingMultiId, @Param("companyId") Long companyId, @Param("r") FormMappingMultiSaveReq req);

    /** AS-IS UpdateDataModel 동적 UPDATE — 내용만 바뀐다(종류·상세·연결 코드는 열 때 받은 값 그대로) */
    int updateContent(@Param("formMappingMultiId") Long formMappingMultiId, @Param("content") String content);
}
